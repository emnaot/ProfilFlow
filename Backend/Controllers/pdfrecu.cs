using Azure;
using Azure.AI.FormRecognizer;
using Azure.AI.FormRecognizer.DocumentAnalysis;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Threading.Tasks;
using Newtonsoft.Json;
using MongoDB.Driver;
using System.Security.Authentication;
using Microsoft.Extensions.Configuration;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Linq;

namespace Example.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class Base64Controller : ControllerBase
    {
        private readonly string _documentAnalysisEndpoint = "";
        private readonly string _documentAnalysisApiKey = "";
        private readonly string _customModelId = "cvmodel";
        private readonly string _cvTrainingFolderPath = @"C:\Users\G I E\Desktop\cvtraining";

        private readonly IMongoCollection<GroupMembers> _collection;

        public Base64Controller(IConfiguration configuration)
        {
            // Récupération de la chaîne de connexion à partir du fichier de configuration (appsettings.json)
            string connectionString = configuration.GetConnectionString("CosmosDBMongo");

            // Configuration des paramètres MongoDB, notamment pour activer SSL
            MongoClientSettings settings = MongoClientSettings.FromUrl(new MongoUrl(connectionString));
            settings.SslSettings = new SslSettings() { EnabledSslProtocols = SslProtocols.Tls12 };

            // Création du client MongoDB
            var client = new MongoClient(settings);

            // Accès à la base de données spécifique
            var database = client.GetDatabase("ProfileFlowDB");

            // Accès à la collection spécifique où les rôles sont stockés
            _collection = database.GetCollection<GroupMembers>("Members");
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Base64DataModel base64Data)
        {
            if (string.IsNullOrEmpty(base64Data?.Base64String) || string.IsNullOrEmpty(base64Data.CollaboratorId))
            {
                return BadRequest("La chaîne Base64 ou l'ID du collaborateur est vide ou nulle.");
            }

            try
            {
                // Diviser la chaîne Base64 en fonction de la virgule
                string[] parts = base64Data.Base64String.Split(',');
                if (parts.Length >= 2)
                {
                    // Obtenir la deuxième partie (contenant le contenu PDF)
                    string pdfBase64String = parts[1];
                    byte[] pdfBytes = Convert.FromBase64String(pdfBase64String);

                    // Enregistrer le PDF localement
                    var filePath = Path.Combine(_cvTrainingFolderPath, $"{base64Data.CollaboratorId}.pdf");
                    await System.IO.File.WriteAllBytesAsync(filePath, pdfBytes);

                    // Envoyer le PDF à Azure Form Recognizer pour analyse
                    using (var stream = new MemoryStream(pdfBytes))
                    {
                        DocumentAnalysisClient client = new DocumentAnalysisClient(new Uri(_documentAnalysisEndpoint), new AzureKeyCredential(_documentAnalysisApiKey));
                        AnalyzeDocumentOperation operation = await client.AnalyzeDocumentAsync(WaitUntil.Completed, _customModelId, stream);
                        await operation.WaitForCompletionAsync();
                        AnalyzeResult result = operation.Value;

                        // Récupérer le contenu du document résultant
                        string jsonContent = JsonConvert.SerializeObject(result);

                        // Remplacer les séquences de sauts de ligne par des sauts de ligne standard
                        jsonContent = jsonContent.Replace("\\n", "\n").Replace("\r\n", "\n");

                        // Analyser le document JSON
                        JObject jsonObject = JObject.Parse(jsonContent);

                        // Trouver le chemin de la section "Fields"
                        string fieldsPath = FindFieldsPath(jsonObject);

                        if (!string.IsNullOrEmpty(fieldsPath))
                        {
                            // Récupérer la section "fields"
                            JToken fields = jsonObject.SelectToken(fieldsPath);

                            // Créer un objet JSON avec les champs spécifiés et leurs valeurs
                            var cvDictionary = new Dictionary<string, string>();
                            cvDictionary["Nom et Prénom"] = GetFieldValue(fields, "Nom et Prénom", "Content");
                            cvDictionary["Titre du cv"] = GetFieldValue(fields, "Titre du cv", "Content");
                            cvDictionary["Informations Personnelles"] = GetFieldValue(fields, "Informations Personnelles", "Content");
                            cvDictionary["Education"] = GetFieldValue(fields, "Education", "Content");
                            cvDictionary["Compétences"] = GetFieldValue(fields, "Compétences", "Content");
                            cvDictionary["Projet Académique"] = GetFieldValue(fields, "Projet Académique", "Content");
                            cvDictionary["Experience Professionnelle"] = GetFieldValue(fields, "Experience Professionnelle", "Content");
                            cvDictionary["Langues"] = GetFieldValue(fields, "Langues", "Content");
                            cvDictionary["Certifications"] = GetFieldValue(fields, "Certifications", "Content");
                            cvDictionary["Vie Associative"] = GetFieldValue(fields, "Vie Associative", "Content");

                            cvDictionary["Centre d'interet"] = GetFieldValue(fields, "centre d'interet", "Content");

                            // Chercher le collaborateur dans Cosmos DB
                            var filter = Builders<GroupMembers>.Filter.Eq(member => member.Id, base64Data.CollaboratorId);
                            var existingMember = await _collection.Find(filter).FirstOrDefaultAsync();

                            if (existingMember != null)
                            {
                                // Mettre à jour les informations du CV pour le collaborateur existant
                                existingMember.CV = existingMember.CV ?? new Dictionary<string, string>[0]; // Initialisation si nécessaire
                                List<Dictionary<string, string>> cvList = existingMember.CV.ToList();

                                // Ajouter le dictionnaire des informations du CV à la liste
                                cvList.Add(cvDictionary);
                                existingMember.CV = cvList.ToArray();

                                var updateResult = await _collection.ReplaceOneAsync(filter, existingMember);

                                if (updateResult.IsAcknowledged && updateResult.ModifiedCount > 0)
                                {
                                    // Le CV a été mis à jour avec succès
                                    return Ok("Extraction réussie. CV mis à jour.");
                                }
                                else
                                {
                                    // Échec de la mise à jour du CV
                                    return StatusCode(500, "Échec de la mise à jour du CV.");
                                }
                            }
                            else
                            {
                                // Collaborateur non trouvé dans la base de données
                                return NotFound("Collaborateur non trouvé dans la base de données.");
                            }
                        }
                        else
                        {
                            // Si la section "fields" n'existe pas, retourner une erreur
                            return BadRequest("La section 'fields' n'a pas été trouvée dans le résultat de l'analyse.");
                        }
                    }
                }
                else
                {
                    return BadRequest("La chaîne Base64 n'est pas au format attendu.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur lors de l'envoi et du traitement du PDF : {ex.Message}");
            }
        }

        private string FindFieldsPath(JToken token, string currentPath = "")
        {
            if (token.Type == JTokenType.Object)
            {
                foreach (var property in ((JObject)token).Properties())
                {
                    if (property.Name.Equals("Fields", StringComparison.OrdinalIgnoreCase))
                    {
                        return currentPath + "." + property.Name;
                    }
                    else
                    {
                        string path = FindFieldsPath(property.Value, currentPath + "." + property.Name);
                        if (!string.IsNullOrEmpty(path))
                        {
                            return path;
                        }
                    }
                }
            }
            else if (token.Type == JTokenType.Array)
            {
                int index = 0;
                foreach (var item in (JArray)token)
                {
                    string path = FindFieldsPath(item, currentPath + "[" + index + "]");
                    if (!string.IsNullOrEmpty(path))
                    {
                        return path;
                    }
                    index++;
                }
            }

            return "";
        }

        private string GetFieldValue(JToken token, params string[] subpaths)
        {
            foreach (var subpath in subpaths)
            {
                token = token[subpath];
                if (token == null)
                {
                    return null;
                }
            }
            return token.ToString();
        }

        public class Base64DataModel
        {
            public string Base64String { get; set; }
            public string CollaboratorId { get; set; } // Ajout de l'ID du collaborateur
        }
    }
}
