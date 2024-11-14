// src/Example.Api/Controllers/CosmosDBController.cs
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Security.Authentication;
using System.Threading.Tasks;
using System;

namespace Example.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CosmosDBController : ControllerBase
    {
        private readonly IMongoCollection<GroupMembers> _collection;

        public CosmosDBController()
        {
            string connectionString = @"";
            MongoClientSettings settings = MongoClientSettings.FromUrl(new MongoUrl(connectionString));
            settings.SslSettings = new SslSettings() { EnabledSslProtocols = SslProtocols.Tls12 };
            var mongoClient = new MongoClient(settings);

            var database = mongoClient.GetDatabase("ProfileFlowDB");
            _collection = database.GetCollection<GroupMembers>("Members");
        }

        [HttpPut("updateGroupMemberRole/{id}")]
        public async Task<IActionResult> UpdateGroupMemberRole(string id, [FromBody] string newRole)
        {
            var filter = Builders<GroupMembers>.Filter.Eq(m => m.Id, id);
            var update = Builders<GroupMembers>.Update.Set(m => m.Role, string.IsNullOrEmpty(newRole) ? "Collaborateur" : newRole);
            var result = await _collection.UpdateOneAsync(filter, update);

            if (result.MatchedCount == 0)
                return NotFound($"Group member with id {id} not found.");

            return Ok($"Role of group member with id {id} updated successfully.");
        }

        [HttpPost("groupMembers")]
        public async Task<IActionResult> SaveGroupMembers([FromBody] List<GroupMembers> groupMembers)
        {
            foreach (var member in groupMembers)
            {
                var filter = Builders<GroupMembers>.Filter.Eq(m => m.Id, member.Id);
                await _collection.ReplaceOneAsync(filter, member, new ReplaceOptions { IsUpsert = true });
            }
            return Ok("Group members saved successfully.");
        }

        [HttpGet("getGroupMembers")]
        public async Task<IActionResult> GetGroupMembers()
        {
            try
            {
                var groupMembers = await _collection.Find(_ => true).ToListAsync();
                return Ok(groupMembers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving group members: {ex.Message}");
            }
        }

        [HttpGet("getGroupMemberByEmail/{email}")]
        public async Task<IActionResult> GetGroupMemberByEmail(string email)
        {
            try
            {
                var filter = Builders<GroupMembers>.Filter.Eq(m => m.Mail, email);
                var groupMember = await _collection.Find(filter).FirstOrDefaultAsync();

                if (groupMember == null)
                {
                    return NotFound(new { message = "Utilisateur non trouvé" });
                }

                return Ok(groupMember);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving the group member: {ex.Message}");
            }
        }
    }

    // Classe pour définir le schéma des membres du groupe
    public class GroupMembers
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string Mail { get; set; }
        public string Role { get; set; } = "Collaborateur";
        public Dictionary<string, string>[] CV { get; set; }
        public string ImageUrl { get; set; }
    }
}
