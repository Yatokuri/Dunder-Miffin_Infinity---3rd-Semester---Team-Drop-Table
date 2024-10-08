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
    
    [HttpGet]
    [Route("api/paper/getstocks")]
    public ActionResult GetStocksByIDs([FromQuery] string productIds)
    {
        if (string.IsNullOrEmpty(productIds))
        {
            return BadRequest("Product IDs are required.");
        }

        var idList = productIds.Split(',').Select(int.Parse).ToList();

        var result = context.Papers
            .Where(p => idList.Contains(p.Id))
            .Select(p => new 
            {
                p.Id,
                p.Stock
            })
            .ToList();

        if (!result.Any())
        {
            return NotFound("No stocks found for the specified product IDs.");
        }

        return Ok(result);
    }

    
    [HttpGet]
    [Route("api/paper/{id}")]
    public ActionResult GetPaper(int id)
    {
        var result = context.Papers.FirstOrDefault(p => p.Id == id);
        if (result == null)
        {
            return NotFound();
        }
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
    
    [HttpPatch]
    [Route("api/paper/discontinue/{id}")]
    public ActionResult<Paper> UpdateDiscontinue(int id, bool discontinued)
    {
        var paperEntity = context.Papers.FirstOrDefault(p => p.Id == id);
        if (paperEntity == null)
        {
            return NotFound();
        }
        paperEntity.Discontinued = discontinued;
        context.SaveChanges();
        return Ok(paperEntity);
    }
    
        
    [HttpPatch]
    [Route("api/paper/continue/{id}")]
    public ActionResult<Paper> UpdateContinue(int id)
    {
        var paperEntity = context.Papers.FirstOrDefault(p => p.Id == id);
        if (paperEntity == null)
        {
            return NotFound();
        }
        paperEntity.Discontinued = false;
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

