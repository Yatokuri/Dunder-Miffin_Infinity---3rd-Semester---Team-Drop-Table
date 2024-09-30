using dataAccess;
using dataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using service.Request.CustomerDto;

namespace api.Controllers;

public class CustomerController(DMIContext context) : ControllerBase
{
    [HttpGet]
    [Route("api/customer")]
    public ActionResult GetAllCustomers()
    {
        var result = context.Customers.ToList();
        return Ok(result);
    }
    
    [HttpGet]
    [Route("api/customer/{id}")]
    public ActionResult GetCustomerById(int id)
    {
        var result = context.Customers.FirstOrDefault(x => x.Id == id);
        if (result == null)
        {
            return NotFound();
        }
        return Ok(result);
    }
    
    [HttpPost]
    [Route("api/customer")]
    public ActionResult<Customer> CreateCustomer([FromBody]CreateCustomerDto order)
    {
        var customerEntity = new Customer()
        {
            Name = order.Name,
            Address = order.Address,
            Phone = order.Phone,
            Email = order.Email
        };
        var result = context.Customers.Add(customerEntity);
        context.SaveChanges();
        return Ok(customerEntity);
    }
    
    [HttpPut]
    [Route("api/customer/{id}")]
    public ActionResult<Customer> UpdateCustomer(int id, [FromBody]EditCustomerDto order)
    {
        var customerEntity = context.Customers.FirstOrDefault(x => x.Id == id);
        if (customerEntity == null)
        {
            return NotFound();
        }
        customerEntity.Name = order.Name;
        customerEntity.Address = order.Address;
        customerEntity.Phone = order.Phone;
        customerEntity.Email = order.Email;
        context.SaveChanges();
        return Ok(customerEntity);
    }
    
    [HttpDelete]
    [Route("api/customer/{id}")]
    public ActionResult DeleteCustomer(int id)
    {
        var customerEntity = context.Customers.FirstOrDefault(x => x.Id == id);
        if (customerEntity == null)
        {
            return NotFound();
        }
        context.Customers.Remove(customerEntity);
        context.SaveChanges();
        return Ok();
    }
}