// src/Example.Api/Controllers/RolesController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Security.Authentication;
using System.Threading.Tasks;

namespace Example.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IMongoCollection<Role> _collection;

        public RolesController(IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("CosmosDBMongo");

            MongoClientSettings settings = MongoClientSettings.FromUrl(new MongoUrl(connectionString));
            settings.SslSettings = new SslSettings() { EnabledSslProtocols = SslProtocols.Tls12 };

            var client = new MongoClient(settings);

            var database = client.GetDatabase("ProfileFlowDB");
            _collection = database.GetCollection<Role>("Roles");
        }

        [HttpPost]
        public async Task<IActionResult> AddRole([FromBody] Role role)
        {
            if (role == null || string.IsNullOrWhiteSpace(role.Roles))
            {
                return BadRequest("Role name is required.");
            }
            await _collection.InsertOneAsync(role);
            return Ok(role);
        }

        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _collection.Find(_ => true).ToListAsync();
            return Ok(roles);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(string id)
        {
            await _collection.DeleteOneAsync(r => r.Id == id);
            return NoContent();
        }
    }

    public class Role
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Roles { get; set; }
    }
}
