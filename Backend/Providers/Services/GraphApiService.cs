using Microsoft.Graph;
using Microsoft.Graph.Models;
using Microsoft.Identity.Web;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Example.Api.Services
{
    public interface IGraphApiService
    {
        Task<User> GetUserProfileAsync(string accessToken);
        Task<List<User>> GetAllUsersAsync(string accessToken);
    }

    public class GraphApiService : IGraphApiService
    {
        public async Task<User> GetUserProfileAsync(string accessToken)
        {
            var client = GetGraphServiceClient(accessToken);
            return await client.Me.GetAsync();
        }

        public async Task<List<User>> GetAllUsersAsync(string accessToken)
        {
            var client = GetGraphServiceClient(accessToken);
            var users = await client.Users.GetAsync();
            return users.Value;
        }

        private GraphServiceClient GetGraphServiceClient(string accessToken)
        {
            var authProvider = new DelegateAuthenticationProvider(async (requestMessage) =>
            {
                requestMessage.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
            });

            return new GraphServiceClient(authProvider);
        }
    }
}
