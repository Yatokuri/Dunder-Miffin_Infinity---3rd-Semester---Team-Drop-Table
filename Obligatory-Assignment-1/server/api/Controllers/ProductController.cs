using Microsoft.AspNetCore.Mvc;
using Service;

namespace api.Controllers;

[ApiController]
public class ProductController(ProductService service) : ControllerBase
{
    
    [HttpGet]
    [Route("api/product")]
    public ActionResult GetAllProducts()
    {
        var products = service.GetAllProducts();
        return Ok(products);
    }
}