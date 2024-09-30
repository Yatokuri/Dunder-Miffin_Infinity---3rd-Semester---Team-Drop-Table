using System.Linq;
using dataAccess;
using dataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    
    [HttpGet("api/order/{id}")]
    public ActionResult<Order> GetOrderById(int id)
    {
        var order = context.Orders
            .Include(o => o.OrderEntries) 
            .ThenInclude(oe => oe.Product)
            .FirstOrDefault(o => o.Id == id);

        if (order == null)
        {
            return NotFound();
        }

        return Ok(order);
    }
    

    
    // Create a new order
    [HttpPost]
    [Route("api/order")]
    public ActionResult<Order> CreateOrder([FromBody] OrderRequestDto orderRequestDto)
    {
        // Validate the incoming request
        if (!orderRequestDto.OrderEntries.Any())
        {
            return BadRequest("Invalid order request.");
        }

        // Check if customer exists based on email
        var customerDto = orderRequestDto.Customer;
        var customer = context.Customers.FirstOrDefault(c => c.Email == customerDto.Email);

        // If customer doesn't exist, create a new customer
        if (customer == null)
        {
            customer = new Customer
            {
                Name = customerDto.Name,
                Address = customerDto.Address,
                Phone = customerDto.Phone,
                Email = customerDto.Email
            };
            
            // Add the new customer to the context
            context.Customers.Add(customer);
            context.SaveChanges(); 
        }

        // Create the order using the DTO
        var order = new Order
        {
            OrderDate = orderRequestDto.Order.OrderDate.ToUniversalTime(), // Set the order date to current UTC time
            DeliveryDate = orderRequestDto.Order.DeliveryDate,
            Status = orderRequestDto.Order.Status,
            TotalAmount = orderRequestDto.Order.TotalAmount,
            CustomerId = customer.Id,
            OrderEntries = orderRequestDto.OrderEntries.Select(entry => new OrderEntry
            {
                ProductId = entry.ProductId,
                Quantity = entry.Quantity 
            }).ToList()
        };

        // Update stock levels for each product in the order
        foreach (var entry in orderRequestDto.OrderEntries)
        {
            var product = context.Papers.FirstOrDefault(p => p.Id == entry.ProductId);
            if (product == null)
            {
                return NotFound($"Product with ID {entry.ProductId} not found.");
            }

            // Check stock levels
            if (product.Stock < entry.Quantity)
            {
                return BadRequest($"Not enough stock for product {product.Name}. Available: {product.Stock}, Requested: {entry.Quantity}");
            }

            // Deduct the stock
            product.Stock -= entry.Quantity;
        }

        // Add the order to the context
        context.Orders.Add(order);
        context.SaveChanges(); // Save changes to the database

        return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
        
    }
    
    [HttpPut] //TODO update stock
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
    public ActionResult CancelOrder(int id)
    {
        // Find the order in the database
        var orderEntity = context.Orders.Include(o => o.OrderEntries).ThenInclude(oe => oe.Product)
            .FirstOrDefault(p => p.Id == id);
        if (orderEntity == null)
        {
            return NotFound();
        }
        
        orderEntity.Status = "Cancelled";

        // Re-add the stock for each product in the order entries
        foreach (var orderEntry in orderEntity.OrderEntries)
        {
            var product = context.Papers.FirstOrDefault(p => p.Id == orderEntry.ProductId);
            if (product != null)
            {
                product.Stock += orderEntry.Quantity; 
            }
        }
        
        context.SaveChanges();
        return Ok();
    }
}