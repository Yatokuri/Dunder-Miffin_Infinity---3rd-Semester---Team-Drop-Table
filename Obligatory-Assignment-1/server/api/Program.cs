var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApiDocument();
builder.Services.AddCors();




var app = builder.Build();
app.UseOpenApi();
app.UseSwaggerUi();

app.UseCors( opts => {

    opts.AllowAnyOrigin();

    opts.AllowAnyMethod();

    opts.AllowAnyHeader();

});


app.MapGet("/", () => "Hello World!");

app.Run();
