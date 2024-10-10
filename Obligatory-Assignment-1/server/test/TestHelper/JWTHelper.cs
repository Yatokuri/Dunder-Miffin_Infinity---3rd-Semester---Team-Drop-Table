using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.IdentityModel.Tokens;

namespace MyNamespace
{
    
}

public static class JWTHelper
{
    // Method to create a HttpClient with Admin role token
    public static HttpClient CreateClientWithAdminToken(WebApplicationFactory<Program> factory)
    {
        var token = GenerateJwtToken(new[] { "Admin" }); // Create token with Admin role
        var client = factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return client;
    }


    // Method to generate a JWT token
    public static string GenerateJwtToken(string[] roles)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, "TestUser"),
            new Claim(ClaimTypes.Role, string.Join(",", roles))
        };

        // Use a symmetric key for signing the token
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("YourVerySecureKeyHereDontReadMyThanks")); 
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "http://localhost/",
            audience: "http://localhost/",
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(30),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}