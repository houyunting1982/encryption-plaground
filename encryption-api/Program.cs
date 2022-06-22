using System.Security.Cryptography;
using encryption_api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


// Add encryptions
var primaryPem = builder.Configuration["Primary:Key"];
var secondaryPem = builder.Configuration["Secondary:Key"];
var primaryRSA = RSA.Create();
var secondaryRSA = RSA.Create();
primaryRSA.ImportFromPem(primaryPem);
secondaryRSA.ImportFromPem(secondaryPem);

var rsaDict = new Dictionary<string, RSA>
{
    ["primary"] = primaryRSA,
    ["secondary"] = secondaryRSA
};

builder.Services.AddSingleton<Dictionary<string, RSA>>(rsaDict);

builder.Services.AddScoped<IEncryptionService, EncryptionService>();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(options => options.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod());
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
