//using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Example.Api.Configuration;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Kiota.Abstractions;
using Microsoft.Kiota.Abstractions.Authentication;
using Microsoft.Net.Http.Headers;

namespace Example.Api.Providers
{
    public class OnBehalfOfMsGraphAuthenticationProvider : IAuthenticationProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly AzureAdOptions _authSettings;

        public OnBehalfOfMsGraphAuthenticationProvider(
            IOptions<AzureAdOptions> authenticationOptions,
            IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _authSettings = authenticationOptions.Value;
        }

        [System.Obsolete]
        public async Task AuthenticateRequestAsync(RequestInformation request, Dictionary<string, object> additionalAuthenticationContext = null, CancellationToken cancellationToken = default)
        {
            var httpContext = _httpContextAccessor.HttpContext;

            string token = httpContext.Request.Headers[HeaderNames.Authorization];
                // await httpContext.GetTokenAsync("access_token");
            
            string assertionType = "urn:ietf:params:oauth:grant-type:jwt-bearer";

            var user = httpContext.User;
            var claim = user.FindFirst(ClaimTypes.Upn) ?? user.FindFirst(ClaimTypes.Email);
            string userName = claim?.Value;


            var userAssertion = new UserAssertion(token, assertionType);

            var authContext = new AuthenticationContext(_authSettings.Authority);
            var clientCredential = new ClientCredential(_authSettings.ClientId, _authSettings.ClientSecret);

            var result = await authContext.AcquireTokenAsync("https://graph.microsoft.com", clientCredential, userAssertion);

            request.Headers.Add("Authorization",$"Bearer {result.AccessToken}");
        }
    }
}
