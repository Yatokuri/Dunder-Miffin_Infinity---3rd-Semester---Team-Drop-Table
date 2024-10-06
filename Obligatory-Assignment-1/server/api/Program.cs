using dataAccess;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
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
        
        app.Run();
    }
}