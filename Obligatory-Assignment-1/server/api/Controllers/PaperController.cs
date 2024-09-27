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
    public ActionResult<Paper> CreatePaper(CreatePaperDto paper)
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
    
    [HttpPut]
    [Route("api/paper/{id}")]
    public ActionResult<Paper> UpdatePaper(int id, EditPaperDto paper)
    {
        var paperEntity = context.Papers.FirstOrDefault(p => p.Id == id);
        if (paperEntity == null)
        {
            return NotFound();
        }
        paperEntity.Name = paper.name;
        paperEntity.Stock = paper.stock;
        paperEntity.Price = paper.price;
        context.SaveChanges();
        return Ok(paperEntity);
    }
    
    [HttpDelete]
    [Route("api/paper/{id}")]
    public ActionResult DeletePaper(int id)
    {
        var paperEntity = context.Papers.FirstOrDefault(p => p.Id == id);
        if (paperEntity == null)
        {
            return NotFound();
        }
        context.Papers.Remove(paperEntity);
        context.SaveChanges();
        return Ok();
    }
    
}

