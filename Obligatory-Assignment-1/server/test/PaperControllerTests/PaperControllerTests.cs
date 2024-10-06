using System.Net;
using dataAccess;
using Microsoft.AspNetCore.Mvc.Testing;
using PgCtx;
using Xunit.Abstractions;
using dataAccess.Models;
using Microsoft.Extensions.DependencyInjection;

namespace test;

public class PaperControllerTests(ITestOutputHelper outputHelper) : WebApplicationFactory<Program>
{
    private PgCtxSetup<DMIContext> pgCtx = new();

    [Fact]
    public async Task TestGetAllPapers()
    {
        Environment.SetEnvironmentVariable("TestDB", pgCtx._postgres.GetConnectionString());

        using (var scope = Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<DMIContext>();

            var paper1 = new Paper
            {
                Name = "Test Paper1",
                Stock = 100,
                Price = 9,
                Discontinued = false
            };
            var paper2 = new Paper
            {
                Name = "Test Paper2",
                Stock = 43,
                Price = 23,
                Discontinued = false
            };

            context.Papers.Add(paper1);
            context.Papers.Add(paper2);
            context.SaveChanges();
        }

        var request = await CreateClient().GetAsync("api/paper");
        outputHelper.WriteLine(await request.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.OK, request.StatusCode);
    }

    [Fact]
    public async Task TestGetPaper()
    {
        Environment.SetEnvironmentVariable("TestDB", pgCtx._postgres.GetConnectionString());

        using (var scope = Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<DMIContext>();

            var paper = new Paper
            {
                Name = "Test Paper",
                Stock = 100,
                Price = 9,
                Discontinued = false
            };

            context.Papers.Add(paper);
            context.SaveChanges();
        }

        var request = await CreateClient().GetAsync("api/paper/1");
        outputHelper.WriteLine(await request.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.OK, request.StatusCode);
    }

    [Fact]
    public async Task TestUpdateDiscontinued()
    {
        Environment.SetEnvironmentVariable("TestDB", pgCtx._postgres.GetConnectionString());

        using (var scope = Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<DMIContext>();

            var paper = new Paper
            {
                Name = "Test Paper",
                Stock = 100,
                Price = 9,
                Discontinued = false
            };

            context.Papers.Add(paper);
            context.SaveChanges();
        }

        var client = CreateClient();
        var response = await client.PatchAsync("api/paper/1?discontinued=true", null);
        outputHelper.WriteLine(await response.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task TestDeletePaper()
    {
        Environment.SetEnvironmentVariable("TestDB", pgCtx._postgres.GetConnectionString());

        using (var scope = Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<DMIContext>();

            var paper = new Paper
            {
                Name = "Test Paper",
                Stock = 100,
                Price = 9,
                Discontinued = false
            };

            context.Papers.Add(paper);
            context.SaveChanges();
        }

        var client = CreateClient();
        var response = await client.DeleteAsync("api/paper/1");
        outputHelper.WriteLine(await response.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}