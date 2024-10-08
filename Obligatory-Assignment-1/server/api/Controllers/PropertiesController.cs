using dataAccess;
using dataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using service.Request;

namespace api.Controllers;

public class PropertiesController(DMIContext context) : ControllerBase
{

    [HttpGet]
    [Route("api/properties")]
    public ActionResult GetAllProperties()
    {
        var result = context.Properties.ToList();
        return Ok(result);
    }
    
    [HttpGet]
    [Route("api/properties/{id}")]
    public ActionResult GetProperty(int id)
    {
        var result = context.Properties.FirstOrDefault(p => p.Id == id);
        if (result == null)
        {
            return NotFound();
        }
        return Ok(result);
    }

    [HttpPost]
    [Route("api/properties")]
    public ActionResult<Paper> CreateProperty(CreatePropertyDto property)
    {
        var propertyEntity = new Property()
        {
            PropertyName = property.PropertyName,
        };
        var result = context.Properties.Add(propertyEntity);
        context.SaveChanges();
        return Ok(propertyEntity);
    }
    
    [HttpPut]
    [Route("api/properties/{id}")]
    public ActionResult<Paper> UpdateProperty(int id, EditPropertyDto property)
    {
        var propertyEntity = context.Properties.FirstOrDefault(p => p.Id == id);
        if (propertyEntity == null)
        {
            return NotFound();
        }
        propertyEntity.PropertyName = property.PropertyName;
        context.SaveChanges();
        return Ok(propertyEntity);
    }
    
    [HttpDelete]
    [Route("api/properties/{id}")]
    public ActionResult DeleteProperty(int id)
    {
        var propertyEntity = context.Properties.FirstOrDefault(p => p.Id == id);
        if (propertyEntity == null)
        {
            return NotFound();
        }
        context.Properties.Remove(propertyEntity);
        context.SaveChanges();
        return Ok();
    }
    
}

