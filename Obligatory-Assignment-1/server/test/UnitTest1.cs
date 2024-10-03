using System.Net;
using System.Text.Json;
using dataAccess;
using Microsoft.AspNetCore.Mvc.Testing;
using PgCtx;
using Xunit.Abstractions;

namespace test;

public class UnitTest1(ITestOutputHelper outputHelper) : WebApplicationFactory<Program>
{
    public PgCtxSetup<DMIContext> PgCtxSetup = new();
    [Fact]
    public async Task Test1()
    {
        Environment.SetEnvironmentVariable("DB", PgCtxSetup._postgres.GetConnectionString());
        var result = await CreateClient().GetAsync("api/paper");

outputHelper.WriteLine(JsonSerializer.Serialize(await result.Content.ReadAsStringAsync()));
        Assert.Equal(HttpStatusCode.OK, result.StatusCode);
    }
}