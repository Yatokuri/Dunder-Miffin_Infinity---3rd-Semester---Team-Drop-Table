using dataAccess;
using dataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using service.Request;

namespace api.Controllers;

public class PaperController(DMIContext context) : ControllerBase
{

    [HttpGet]
    [Route("api/paper")]
    public ActionResult GetAllPapers()
    {
        var result = context.Papers.ToList();
        return Ok(result);
    }

    [HttpPost]
    [Route("api/paper")]
    public ActionResult<Paper> CreatePaper([FromBody]CreatePaperDto paper)
    {
        var paperEntity = new Paper()
        {
            Name = paper.name,
            Stock = paper.stock,
            Price = paper.price
        };
        var result = context.Papers.Add(paperEntity);
        context.SaveChanges();
        return Ok(paperEntity);
    }
    
}

