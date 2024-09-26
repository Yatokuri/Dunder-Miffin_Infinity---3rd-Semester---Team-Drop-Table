using dataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using service;

namespace api.Controllers;

public class PaperController(PaperService service) : ControllerBase
{
    
    [HttpGet]
    [Route("api/paper")]
    public ActionResult GetAllPapers()
    {
        var papers = service.GetAllPapers();
        return Ok(papers);
    }
    
    [HttpPost]
    [Route("api/paper")]
    public ActionResult AddPaper([FromBody] Paper paper)
    {
        var newPaper = service.AddPaper(paper);
        return Ok(newPaper);
    }
    
    
}