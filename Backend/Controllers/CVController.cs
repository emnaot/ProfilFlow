using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Security.Authentication;
using System.Threading.Tasks;
//
namespace Example.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CVController : ControllerBase
    {
        private readonly IMongoCollection<GroupMembers> _collection;

        public CVController(IConfiguration configuration)
        {
            // Initialise la collection MongoDB pour accéder aux documents CV
            string connectionString = configuration.GetConnectionString("");
            MongoClientSettings settings = MongoClientSettings.FromUrl(new MongoUrl(connectionString));
            settings.SslSettings = new SslSettings() { EnabledSslProtocols = SslProtocols.Tls12 };
            var mongoClient = new MongoClient(settings);

            var database = mongoClient.GetDatabase("ProfileFlowDB");
            _collection = database.GetCollection<GroupMembers>("Members");
        }

        [HttpGet("getCVById/{id}")]
        public async Task<IActionResult> GetCVById(string id)
        {
            try
            {
                var filter = Builders<GroupMembers>.Filter.Eq(member => member.Id, id);
                var member = await _collection.Find(filter).FirstOrDefaultAsync();

                if (member != null && member.CV != null)
                {
                    return Ok(member.CV);
                }
                else
                {
                    return NotFound(new { message = "CV not found for the specified Id." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred while retrieving CV: {ex.Message}" });
            }
        }

        [HttpGet("getCVByEmail/{email}")]
        public async Task<IActionResult> GetCVByEmail(string email)
        {
            try
            {
                var filter = Builders<GroupMembers>.Filter.Eq(member => member.Mail, email);
                var member = await _collection.Find(filter).FirstOrDefaultAsync();

                if (member != null && member.CV != null)
                {
                    return Ok(member.CV);
                }
                else
                {
                    return NotFound(new { message = "CV not found for the specified email." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred while retrieving CV: {ex.Message}" });
            }
        }

        [HttpPut("updateCVById/{id}")]
        public async Task<IActionResult> UpdateCVById(string id, [FromBody] Dictionary<string, string>[] newCV)
        {
            try
            {
                var filter = Builders<GroupMembers>.Filter.Eq(member => member.Id, id);
                var update = Builders<GroupMembers>.Update.Set(member => member.CV, newCV);
                var result = await _collection.UpdateOneAsync(filter, update);

                if (result.MatchedCount > 0)
                    return Ok(new { message = "CV updated successfully." });
                else
                    return NotFound(new { message = "No member found with the specified ID." });
            }
            catch (FormatException fe)
            {
                return BadRequest(new { message = $"Bad Request: {fe.Message}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred while updating CV: {ex.Message}" });
            }
        }

        [HttpPut("updateCVByEmail/{email}")]
        public async Task<IActionResult> UpdateCVByEmail(string email, [FromBody] Dictionary<string, string>[] newCV)
        {
            try
            {
                var filter = Builders<GroupMembers>.Filter.Eq(member => member.Mail, email);
                var update = Builders<GroupMembers>.Update.Set(member => member.CV, newCV);
                var result = await _collection.UpdateOneAsync(filter, update);

                if (result.MatchedCount > 0)
                    return Ok(new { message = "CV updated successfully." });
                else
                    return NotFound(new { message = "No member found with the specified email." });
            }
            catch (FormatException fe)
            {
                return BadRequest(new { message = $"Bad Request: {fe.Message}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred while updating CV: {ex.Message}" });
            }
        }

        [HttpDelete("{collaboratorId}")]
        public async Task<IActionResult> DeleteCV(string collaboratorId)
        {
            try
            {
                var filter = Builders<GroupMembers>.Filter.Eq(member => member.Id, collaboratorId);
                // Création explicite de FieldDefinition
                var field = new StringFieldDefinition<GroupMembers, string>("CV");
                var update = Builders<GroupMembers>.Update.Set(field, (string)null); // Utiliser FieldDefinition pour mettre le champ CV à null
                var result = await _collection.UpdateOneAsync(filter, update);
                if (result.MatchedCount > 0)
                    return Ok(new { message = "CV set to null successfully." });
                else
                    return NotFound(new { message = "CV not found for the specified collaborator." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred while setting CV to null: {ex.Message}" });
            }
        }
    }
}
