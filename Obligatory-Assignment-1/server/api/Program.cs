using System.Text;
using dataAccess;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Service.Validators;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var envFilePath = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "config.env");
        if (File.Exists(envFilePath))
        {
            var envVariables = File.ReadAllLines(envFilePath);
            foreach (var variable in envVariables)
            {
                if (variable.Contains('='))
                {
                    var parts = variable.Split('=');
                    if (parts.Length == 2)
                    {
                        Environment.SetEnvironmentVariable(parts[0], parts[1]);
                    }
                }
            }
        }

// Construct the PostgreSQL connection string using environment variables
        var user = Environment.GetEnvironmentVariable("POSTGRES_USER");
        var password = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");
        var database = Environment.GetEnvironmentVariable("POSTGRES_DB");

        var connectionString = $"Host=localhost;Database={database};Username={user};Password={password};";
        
        builder.Services.AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<OrderStatusValidator>());
        
        builder.Services.AddControllers();

// Register the DbContext with PostgreSQL using the constructed connection string
        builder.Services.AddDbContext<DMIContext>(options =>
        {
            options.UseNpgsql(Environment.GetEnvironmentVariable("TestDB") ?? connectionString);
            options.EnableSensitiveDataLogging();
        });

        builder.Services.AddDbContext<DMIContext>(opt => opt.UseInMemoryDatabase("DMI"));

        builder.Services.AddOpenApiDocument(configure =>
        {
            configure.Title = "Dunder Mifflin Infinity";
            configure.Description = "Try and test";
            configure.Version = "v1";
        });

        builder.Services.AddCors();

        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                // Load JWT settings from environment variables
                var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? "SecretKey";;
                var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "http://localhost/";;
                var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "http://localhost/";;
                

                // Check for null values and log them (not necessary for hardcoded values, but good practice)
                if (string.IsNullOrEmpty(jwtKey) || string.IsNullOrEmpty(jwtIssuer) || string.IsNullOrEmpty(jwtAudience))
                {
                    throw new ArgumentNullException("JWT settings are not properly configured.");
                }

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
                };
            });


        var app = builder.Build();
        app.UseOpenApi();
        app.UseSwaggerUi();

        app.MapControllers();

        app.UseCors(opts =>
        {
            opts.AllowAnyOrigin();

            opts.AllowAnyMethod();

            opts.AllowAnyHeader();
        });

        // Use Authentication and Authorization Middleware
        app.UseAuthentication(); // This must come before UseAuthorization
        app.UseAuthorization();

        // Map controllers
        app.MapControllers();

        app.Run();
    }
}