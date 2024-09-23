using dataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using service;

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
    
    [HttpPost]
    [Route("api/product")]
    public ActionResult AddProduct([FromBody] Product product)
    {
        var newProduct = service.AddProduct(product);
        return Ok(newProduct);
    }
    
}