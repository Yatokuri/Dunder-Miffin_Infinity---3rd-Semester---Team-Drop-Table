using dataAccess;
using dataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using service.Request.OrderEntryDto;

namespace api.Controllers;

public class OrderEntryController(DMIContext context) : ControllerBase
{
    [HttpGet]
    [Route("api/order-entry")]
    public ActionResult GetAllOrderEntries()
    {
        var result = context.OrderEntries.ToList();
        return Ok(result);
    }
    
    [HttpGet]
    [Route("api/order-entry/{id}")]
    public ActionResult GetOrderEntryById(int id)
    {
        var result = context.OrderEntries.FirstOrDefault(x => x.Id == id);
        if (result == null)
        {
            return NotFound();
        }
        return Ok(result);
    }
    
    [HttpPost]
    [Route("api/order-entry")]
    public ActionResult<OrderEntry> CreateOrderEntry([FromBody] CreateOrderEntryDto orderEntryDto)
    {
        var orderEntryEntity = new OrderEntry()
        {
            ProductId = orderEntryDto.ProductId,
            Quantity = orderEntryDto.Quantity
        };

        var result = context.OrderEntries.Add(orderEntryEntity);
        context.SaveChanges();
        return Ok(orderEntryEntity);
    }
    
    [HttpPut]
    [Route("api/order-entry/{id}")]
    public ActionResult<OrderEntry> UpdateOrderEntry(int id, [FromBody] EditOrderEntryDto orderEntryDto)
    {
        var orderEntryEntity = context.OrderEntries.FirstOrDefault(x => x.Id == id);
        if (orderEntryEntity == null)
        {
            return NotFound();
        }

        orderEntryEntity.ProductId = orderEntryDto.ProductId;
        orderEntryEntity.Quantity = orderEntryDto.Quantity;

        context.SaveChanges();
        return Ok(orderEntryEntity);
    }
    
    [HttpDelete]
    [Route("api/order-entry/{id}")]
    public ActionResult DeleteOrderEntry(int id)
    {
        var orderEntryEntity = context.OrderEntries.FirstOrDefault(x => x.Id == id);
        if (orderEntryEntity == null)
        {
            return NotFound();
        }

        context.OrderEntries.Remove(orderEntryEntity);
        context.SaveChanges();
        return Ok();
    }
}
