using dataAccess;
using dataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using service.Request.OrderDto;

namespace api.Controllers;

public class OrderController(DMIContext context) : ControllerBase
{
    [HttpGet]
    [Route("api/order")]
    public ActionResult GetAllOrders()
    {
        var result = context.Orders.ToList();
        return Ok(result);
    }
    
    [HttpPost]
    [Route("api/order")]
    public ActionResult<Order> CreateOrder([FromBody]CreateOrderDto order)
    {
        var orderEntity = new Order()
        {
            OrderDate = order.OrderDate,
            DeliveryDate = order.DeliveryDate,
            Status = order.Status,
            TotalAmount = order.TotalAmount
        };
        var result = context.Orders.Add(orderEntity);
        context.SaveChanges();
        return Ok(orderEntity);
    }
    
    [HttpPut]
    [Route("api/order/{id}")]
    public ActionResult<Order> UpdateOrder(int id, [FromBody]EditOrderDto order)
    {
        var orderEntity = context.Orders.FirstOrDefault(p => p.Id == id);
        if (orderEntity == null)
        {
            return NotFound();
        }
        orderEntity.OrderDate = order.OrderDate;
        orderEntity.DeliveryDate = order.DeliveryDate;
        orderEntity.Status = order.Status;
        orderEntity.TotalAmount = order.TotalAmount;
        context.SaveChanges();
        return Ok(orderEntity);
    }
    
    [HttpDelete]
    [Route("api/order/{id}")]
    public ActionResult DeleteOrder(int id)
    {
        var orderEntity = context.Orders.FirstOrDefault(p => p.Id == id);
        if (orderEntity == null)
        {
            return NotFound();
        }
        context.Orders.Remove(orderEntity);
        context.SaveChanges();
        return Ok();
    }
}