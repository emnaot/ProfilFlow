// src/Example.Api/Controllers/UserController.cs
using Azure.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Example.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly GraphServiceClient _graphClient;
        private readonly CosmosDBController _cosmosController;

        public UserController()
        {
            _graphClient = CreateGraphClient("", "", "");
            _cosmosController = new CosmosDBController();
        }

        [HttpGet("group/e308a483-938b-4caf-a690-1b0df79b325d/members")]
        public async Task<IActionResult> GetGroupMembers(string groupId)
        {
            DirectoryObjectCollectionResponse members = await _graphClient.Groups[""].Members.GetAsync();
            var users = new List<GroupMembers>();
            foreach (var member in members.Value)
            {
                var user = (User)member;
                users.Add(new GroupMembers
                {
                    Id = user.Id,
                    DisplayName = user.DisplayName,
                    Mail = user.Mail,
                    Role = "Collaborateur"
                });
            }

            await _cosmosController.SaveGroupMembers(users);

            return Ok(users);
        }

        [HttpGet("getUserRoleByEmail/{email}")]
        public async Task<IActionResult> GetUserRoleByEmail(string email)
        {
            var response = await _cosmosController.GetGroupMemberByEmail(email) as ObjectResult;
            if (response?.StatusCode != 200)
            {
                return response;
            }

            var groupMember = response.Value as GroupMembers;
            return Ok(new
            {
                id = groupMember.Id,
                displayName = groupMember.DisplayName,
                role = groupMember.Role,
                mail = groupMember.Mail,

            });
        }

        private GraphServiceClient CreateGraphClient(string tenantId, string clientId, string clientSecret)
        {
            var options = new TokenCredentialOptions
            {
                AuthorityHost = AzureAuthorityHosts.AzurePublicCloud
            };

            var clientSecretCredential = new ClientSecretCredential(
                tenantId, clientId, clientSecret, options);
            var scopes = new[] { "" };

            return new GraphServiceClient(clientSecretCredential, scopes);
        }
    }
}
