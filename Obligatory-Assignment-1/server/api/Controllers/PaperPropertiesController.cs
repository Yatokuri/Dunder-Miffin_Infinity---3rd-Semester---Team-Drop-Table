using dataAccess;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

public class PaperPropertiesController(DMIContext context) : ControllerBase
{
    
    [HttpPost]
    [Route("api/paper/{paperId}/properties/{propertyId}")]
    public ActionResult AddPropertyToPaper(int paperId, int propertyId)
    {
        var paper = context.Papers.FirstOrDefault(p => p.Id == paperId);
        if (paper == null)
        {
            return NotFound();
        }
        var property = context.Properties.FirstOrDefault(p => p.Id == propertyId);
        if (property == null)
        {
            return NotFound();
        }
        paper.Properties.Add(property);
        context.SaveChanges();
        return Ok();
    }
    
    [HttpGet]
    [Route("api/paper/{paperId}/properties")]
    public ActionResult GetPropertiesForPaper(int paperId)
    {
        var paper = context.Papers.FirstOrDefault(p => p.Id == paperId);
        if (paper == null)
        {
            return NotFound();
        }
        return Ok(paper.Properties);
    }
    
    [HttpDelete]
    [Route("api/paper/{paperId}/properties/{propertyId}")]
    public ActionResult RemovePropertyFromPaper(int paperId, int propertyId)
    {
        var paper = context.Papers.FirstOrDefault(p => p.Id == paperId);
        if (paper == null)
        {
            return NotFound();
        }
        var property = context.Properties.FirstOrDefault(p => p.Id == propertyId);
        if (property == null)
        {
            return NotFound();
        }
        paper.Properties.Remove(property);
        context.SaveChanges();
        return Ok();
    }
    
}