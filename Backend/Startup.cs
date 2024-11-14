using Example.Api.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using Azure.Identity;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using Microsoft.OpenApi.Any;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Example.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.AddCors(options =>
            {
                options.AddPolicy("AllowMyOrigin",
                    builder => builder.WithOrigins("")
                                      .AllowAnyHeader()
                                      .AllowAnyMethod()
                                      .AllowCredentials());
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Example API", Version = "v1" });

                c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.OAuth2,
                    Flows = new OpenApiOAuthFlows
                    {
                        Implicit = new OpenApiOAuthFlow
                        {
                            AuthorizationUrl = new Uri(""),
                            TokenUrl = new Uri(""),
                            Scopes = new Dictionary<string, string>
                            {
                                { "Directory.ReadWrite.All", "Full access to directory" },
                                { "Group.ReadWrite.All", "Read and write groups" },
                                { "Mail.ReadWrite", "Read and write all users' mail" },
                                { "User.Read", "Read users' profiles" },
                                { "User.Read.All", "Read all users' basic profiles" },
                                { "User.ReadBasic.All", "Read all users' basic profiles" },
                                { "User.ReadWrite", "Access read and write to user profile" },
                                { "User.ReadWrite.All", "Read and write all users' profiles" }
                            }
                        }
                    }
                });

                c.SchemaFilter<CustomSchemaFilter>();
            });

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    var authSettings = Configuration.GetSection("AzureAd").Get<AzureAdOptions>();

                    options.Audience = authSettings.ClientId;
                    options.Authority = $"{authSettings.Instance}{authSettings.TenantId}";
                });

            services.Configure<AzureAdOptions>(Configuration.GetSection("AzureAd"));
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddScoped<GraphServiceClient>(sp =>
            {
                var authSettings = sp.GetRequiredService<IOptions<AzureAdOptions>>().Value;

                var credentials = new ClientSecretCredential(
                    authSettings.TenantId,
                    authSettings.ClientId,
                    authSettings.ClientSecret
                );

                return new GraphServiceClient(credentials);
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors("AllowMyOrigin");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Example API V1");
                c.OAuthClientId("");
                c.OAuthAppName("");
                c.OAuthScopeSeparator(" ");
                c.OAuthUsePkce();
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }

    public class CustomSchemaFilter : ISchemaFilter
    {
        public void Apply(OpenApiSchema schema, SchemaFilterContext context)
        {
            if (context.Type == typeof(Dictionary<string, string>))
            {
                schema.Example = new OpenApiObject
                {
                    ["Nom et Prénom"] = new OpenApiString("String"),
                    ["Titre du cv"] = new OpenApiString("String"),
                    ["Informations Personnelles"] = new OpenApiString("String"),
                    ["Education"] = new OpenApiString("String"),
                    ["Compétences"] = new OpenApiString("String"),
                    ["Projet Académique"] = new OpenApiString("String"),
                    ["Experience Professionnelle"] = new OpenApiString("String"),
                    ["Langues"] = new OpenApiString("String"),
                    ["Certifications"] = new OpenApiString("String"),
                    ["Vie Associative"] = new OpenApiString("String"),
                    ["Centre d'interet"] = new OpenApiString("String")
                };
            }
        }
    }
}
