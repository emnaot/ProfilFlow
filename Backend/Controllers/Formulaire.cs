using Microsoft.AspNetCore.Mvc;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;
using Azure.AI.FormRecognizer.DocumentAnalysis;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Collections.Generic;
using Azure;
using MongoDB.Driver;
using System.Security.Authentication;
using Microsoft.Extensions.Configuration;
using System.Linq;
using MongoDB.Bson;

namespace Example.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FormulaireController : ControllerBase
    {
        private readonly ILogger<FormulaireController> _logger;
        private readonly string _documentAnalysisEndpoint = "";
        private readonly string _documentAnalysisApiKey = "";
        private readonly string _customModelId = "";

        private readonly string _cvTrainingFolderPath = @"C:\Users\G I E\Desktop\cvtraining";

        private readonly IMongoCollection<GroupMembers> _collection;
        private List<string> _extractedValues = new List<string>();

        public FormulaireController(IConfiguration configuration, ILogger<FormulaireController> logger)
        {
            _logger = logger;

            string connectionString = configuration.GetConnectionString("CosmosDBMongo");
            MongoClientSettings settings = MongoClientSettings.FromUrl(new MongoUrl(connectionString));
            settings.SslSettings = new SslSettings() { EnabledSslProtocols = SslProtocols.Tls12 };

            var client = new MongoClient(settings);
            var database = client.GetDatabase("ProfileFlowDB");
            _collection = database.GetCollection<GroupMembers>("Members");
        }

        public class FormData
        {
            public string Formations { get; set; }
            public string Durée_Expériences { get; set; }
            public string Technologies_Demandées { get; set; }
            public string Description_Mission { get; set; }
        }

        public class DocumentOccurrence
        {
            public string DisplayName { get; set; }
            public string Id { get; set; }
            public int NumberOfValuesFound { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> RecevoirFormulaire([FromBody] FormData formData)
        {
            _logger.LogInformation("Données du formulaire reçues : {FormData}", formData);

            string timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
            string outputPath = $@"C:\Users\G I E\Desktop\cvtraining\example_{timestamp}.pdf";

            try
            {
                // Générer le fichier PDF avec les données du formulaire
                using (PdfWriter writer = new PdfWriter(outputPath))
                using (PdfDocument pdf = new PdfDocument(writer))
                using (Document document = new Document(pdf))
                {
                    document.Add(new Paragraph($"Formations: {formData.Formations}"));
                    document.Add(new Paragraph($"Durée_Expériences: {formData.Durée_Expériences}"));
                    document.Add(new Paragraph($"Technologies Demandées: {formData.Technologies_Demandées}"));
                    document.Add(new Paragraph($"Description de la Mission: {formData.Description_Mission}"));
                }

                if (System.IO.File.Exists(outputPath))
                {
                    byte[] pdfBytes = System.IO.File.ReadAllBytes(outputPath);

                    using (var stream = new MemoryStream(pdfBytes))
                    {
                        DocumentAnalysisClient client = new DocumentAnalysisClient(new Uri(_documentAnalysisEndpoint), new AzureKeyCredential(_documentAnalysisApiKey));
                        AnalyzeDocumentOperation operation = await client.AnalyzeDocumentAsync(WaitUntil.Completed, _customModelId, stream);
                        await operation.WaitForCompletionAsync();
                        AnalyzeResult result = operation.Value;

                        string jsonContent = JsonConvert.SerializeObject(result);
                        JObject jsonObject = JObject.Parse(jsonContent);

                        string fieldsPath = FindFieldsPath(jsonObject);

                        if (!string.IsNullOrEmpty(fieldsPath))
                        {
                            JToken fields = jsonObject.SelectToken(fieldsPath);
                            string jsonOutputPath = $@"C:\Users\G I E\Desktop\cvtraining\fields_result_{timestamp}.json";
                            string jsonFieldData = fields.ToString();
                            System.IO.File.WriteAllText(jsonOutputPath, jsonFieldData);

                            var cvDictionary = ExtractFields(fields);

                            _extractedValues.AddRange(cvDictionary.Values);

                            if (_extractedValues.Any())
                            {
                                var topThreeDocuments = await IdentifyTopThreeDocuments(_extractedValues);
                                if (topThreeDocuments != null && topThreeDocuments.Any())
                                {
                                    var documentInfos = topThreeDocuments.Select(doc => new { doc.DisplayName, doc.Id }).ToList();
                                    return Ok(documentInfos);
                                }
                                else
                                {
                                    return NotFound("Aucun collaborateur adéquat trouvé.");
                                }
                            }
                        }
                    }
                }
                else
                {
                    _logger.LogError("Erreur lors de la génération du fichier PDF : Le fichier n'a pas été trouvé.");
                    return StatusCode(500, "Erreur lors de la génération du fichier PDF : Le fichier n'a pas été trouvé.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la génération du fichier PDF ou de l'envoi à Form Recognizer");
                return StatusCode(500, $"Erreur lors de la génération du fichier PDF ou de l'envoi à Form Recognizer : {ex.Message}");
            }

            return StatusCode(500, "Erreur inattendue lors du traitement du formulaire.");
        }

        [HttpGet("top-three-documents")]
        public async Task<IActionResult> GetTopThreeDocuments()
        {
            if (_extractedValues == null || _extractedValues.Count == 0)
            {
                return BadRequest("Liste de valeurs extraites non valide.");
            }

            var topThreeDocuments = await IdentifyTopThreeDocuments(_extractedValues);

            if (topThreeDocuments != null && topThreeDocuments.Any())
            {
                var documentInfos = topThreeDocuments.Select(doc => new { doc.DisplayName, doc.Id }).ToList();

                return Ok(documentInfos);
            }
            else
            {
                return NotFound("Aucun document trouvé.");
            }
        }

        private async Task<List<DocumentOccurrence>> IdentifyTopThreeDocuments(List<string> extractedValues)
        {
            var lowerCaseExtractedValues = extractedValues.Select(v => v.ToLower()).ToList();
            var documentsWithMostOccurrences = new List<DocumentOccurrence>();
            string[] separators = new string[] { ".", " ", "\n", "/", @"\n", "\"", "," };

            var documents = await _collection.Find(Builders<GroupMembers>.Filter.Empty).ToListAsync().ConfigureAwait(false);

            if (documents != null && documents.Any())
            {
                foreach (var doc in documents)
                {
                    int count = 0;
                    foreach (var cv in doc.CV)
                    {
                        foreach (var value in cv.Values)
                        {
                            if (!string.IsNullOrEmpty(value))
                            {
                                string[] mots = value.Split(separators, StringSplitOptions.RemoveEmptyEntries);

                                foreach (var mot in mots)
                                {
                                    if (lowerCaseExtractedValues.Contains(mot.ToLower()))
                                    {
                                        count++;
                                    }
                                }
                            }
                        }
                    }
                    if (count > 0)
                    {
                        documentsWithMostOccurrences.Add(new DocumentOccurrence { DisplayName = doc.DisplayName, Id = doc.Id.ToString(), NumberOfValuesFound = count });
                    }
                }

                documentsWithMostOccurrences = documentsWithMostOccurrences.OrderByDescending(d => d.NumberOfValuesFound).ToList();
                var topThreeDocuments = documentsWithMostOccurrences.Take(3).ToList();

                return topThreeDocuments;
            }

            return null;
        }

        private Dictionary<string, string> ExtractFields(JToken fields)
        {
            var cvDictionary = new Dictionary<string, string>();

            if (!string.IsNullOrEmpty(GetFieldValue(fields, "formation", "Content")))
            {
                cvDictionary["formation"] = GetFieldValue(fields, "formation", "Content");
            }

            if (!string.IsNullOrEmpty(GetFieldValue(fields, "formation2", "Content")))
            {
                cvDictionary["formation2"] = GetFieldValue(fields, "formation2", "Content");
            }

            if (!string.IsNullOrEmpty(GetFieldValue(fields, "foormation3", "Content")))
            {
                cvDictionary["foormation3"] = GetFieldValue(fields, "foormation3", "Content");
            }

            if (!string.IsNullOrEmpty(GetFieldValue(fields, "formation3", "Content")))
            {
                cvDictionary["formation3"] = GetFieldValue(fields, "formation3", "Content");
            }

            if (!string.IsNullOrEmpty(GetFieldValue(fields, "formation4", "Content")))
            {
                cvDictionary["formation4"] = GetFieldValue(fields, "formation4", "Content");
            }

            if (!string.IsNullOrEmpty(GetFieldValue(fields, "durée experience", "Content")))
            {
                cvDictionary["durée experience"] = GetFieldValue(fields, "durée experience", "Content");
            }

            if (!string.IsNullOrEmpty(GetFieldValue(fields, "technologie", "Content")))
            {
                cvDictionary["technologie"] = GetFieldValue(fields, "technologie", "Content");
            }

            if (!string.IsNullOrEmpty(GetFieldValue(fields, "mission 1", "Content")))
            {
                cvDictionary["mission 1"] = GetFieldValue(fields, "mission 1", "Content");
            }

            if (!string.IsNullOrEmpty(GetFieldValue(fields, "mission 2", "Content")))
            {
                cvDictionary["mission 2"] = GetFieldValue(fields, "mission 2", "Content");
            }

            if (!string.IsNullOrEmpty(GetFieldValue(fields, "technologie 2", "Content")))
            {
                cvDictionary["technologie 2"] = GetFieldValue(fields, "technologie 2", "Content");
            }

            if (!string.IsNullOrEmpty(GetFieldValue(fields, "technologie 3", "Content")))
            {
                cvDictionary["technologie 3"] = GetFieldValue(fields, "technologie 3", "Content");
            }

            if (!string.IsNullOrEmpty(GetFieldValue(fields, "technologie 4", "Content")))
            {
                cvDictionary["technologie 4"] = GetFieldValue(fields, "technologie 4", "Content");
            }

            if (!string.IsNullOrEmpty(GetFieldValue(fields, "technologie 5", "Content")))
            {
                cvDictionary["technologie 5"] = GetFieldValue(fields, "technologie 5", "Content");
            }

            if (!string.IsNullOrEmpty(GetFieldValue(fields, "technologie 6", "Content")))
            {
                cvDictionary["technologie 6"] = GetFieldValue(fields, "technologie 6", "Content");
            }

            if (!string.IsNullOrEmpty(GetFieldValue(fields, "technologie 7", "Content")))
            {
                cvDictionary["technologie 7"] = GetFieldValue(fields, "technologie 7", "Content");
            }

            if (!string.IsNullOrEmpty(GetFieldValue(fields, "technologie 8", "Content")))
            {
                cvDictionary["technologie 8"] = GetFieldValue(fields, "technologie 8", "Content");
            }

            if (!string.IsNullOrEmpty(GetFieldValue(fields, "mission 4", "Content")))
            {
                cvDictionary["mission 4"] = GetFieldValue(fields, "mission 4", "Content");
            }

            if (!string.IsNullOrEmpty(GetFieldValue(fields, "mission 3", "Content")))
            {
                cvDictionary["mission 3"] = GetFieldValue(fields, "mission 3", "Content");
            }

            if (!string.IsNullOrEmpty(GetFieldValue(fields, "technologie 9", "Content")))
            {
                cvDictionary["technologie 9"] = GetFieldValue(fields, "technologie 9", "Content");
            }

            return cvDictionary;
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
    }
}
