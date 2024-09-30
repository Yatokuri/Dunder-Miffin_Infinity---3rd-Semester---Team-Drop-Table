using System.Linq;
using dataAccess;
using dataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using service.Request.OrderDto;
using service.Request.OrderEntryDto;

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
        if (!orderRequestDto.OrderEntries.Any())
        {
            return BadRequest(new ErrorResponse { Errors = new List<string> { "Invalid order request." } });
        }

        var customerDto = orderRequestDto.Customer;
        var customer = context.Customers.FirstOrDefault(c => c.Email == customerDto.Email);

        if (customer == null)
        {
            customer = new Customer
            {
                Name = customerDto.Name,
                Address = customerDto.Address,
                Phone = customerDto.Phone,
                Email = customerDto.Email
            };

            context.Customers.Add(customer);
            context.SaveChanges(); 
        }

        var order = new Order
        {
            OrderDate = orderRequestDto.Order.OrderDate.ToUniversalTime(),
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

        var stockUpdateResult = UpdateStockLevels(orderRequestDto.OrderEntries);
        if (stockUpdateResult.Errors.Count > 0) 
        {
            return BadRequest(stockUpdateResult); // Return any error from stock update
        }

        context.Orders.Add(order);
        context.SaveChanges();

        return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
    }

    [HttpPut]
    [Route("api/order/{id}")]
    public ActionResult<Order> UpdateOrder(int id, [FromBody] OrderRequestDto orderDto)
    {
        var orderEntity = context.Orders
            .Include(o => o.OrderEntries)
            .ThenInclude(oe => oe.Product) 
            .FirstOrDefault(p => p.Id == id);

        if (orderEntity == null)
        {
            return NotFound();
        }

        // Update the order fields
        orderEntity.OrderDate = orderDto.Order.OrderDate;
        orderEntity.DeliveryDate = orderDto.Order.DeliveryDate;
        orderEntity.Status = orderDto.Order.Status;
        orderEntity.TotalAmount = orderDto.Order.TotalAmount;

        // Update order entries if provided in the DTO
        if (orderDto.OrderEntries.Count > 0)
        {
            foreach (var orderEntryDto in orderDto.OrderEntries)
            {
                var orderEntryEntity = orderEntity.OrderEntries
                    .FirstOrDefault(oe => oe.ProductId == orderEntryDto.ProductId);

                if (orderEntryEntity != null)
                {
                    orderEntryEntity.Quantity = orderEntryDto.Quantity; 
                }
                else
                {
                    var newOrderEntry = new OrderEntry
                    {
                        ProductId = orderEntryDto.ProductId,
                        Quantity = orderEntryDto.Quantity,
                    };
                    orderEntity.OrderEntries.Add(newOrderEntry);
                }
            }

            var stockUpdateResult = UpdateStockLevels(orderDto.OrderEntries);
            if (stockUpdateResult.Errors.Count > 0) 
            {
                return BadRequest(stockUpdateResult); // Return any error from stock update
            }
        }

        context.SaveChanges(); 
        return Ok(orderEntity); 
    }

    
    [HttpPut]
    [Route("api/order/cancel/{id}")]
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
    
    [HttpDelete] // Use DELETE for canceling the orders
    [Route("api/order/{id}")]
    public ActionResult DeleteOrder(int id)
    {
        // Find the order in the database including its order entries
        var orderEntity = context.Orders
            .Include(o => o.OrderEntries) // Include order entries to access them
            .ThenInclude(oe => oe.Product) // Include Product if needed for stock adjustment
            .FirstOrDefault(p => p.Id == id);

        if (orderEntity == null)
        {
            return NotFound(); // Return 404 if the order doesn't exist
        }

        // Re-add the stock for each product in the order entries
        foreach (var orderEntry in orderEntity.OrderEntries)
        {
            var product = context.Papers.FirstOrDefault(p => p.Id == orderEntry.ProductId);
            if (product != null)
            {
                product.Stock += orderEntry.Quantity; // Restock the product
            }
        }

        // Remove the order and its entries from the database
        context.OrderEntries.RemoveRange(orderEntity.OrderEntries);
        context.Orders.Remove(orderEntity);
        context.SaveChanges();

        return Ok();
    }

    private ErrorResponse UpdateStockLevels(List<CreateOrderEntryDto> orderEntries)
    {
        var errorResponse = new ErrorResponse();

        foreach (var entry in orderEntries)
        {
            var product = context.Papers.Find(entry.ProductId); // Assuming you have a Products DbSet

            if (product == null)
            {
                errorResponse.Errors.Add($"Product with ID {entry.ProductId} not found.");
                continue; // Skip to the next product
            }

            // Check stock levels
            if (product.Stock < entry.Quantity)
            {
                errorResponse.Errors.Add($"Insufficient stock for product ID {entry.ProductId}. Available: {product.Stock}, Requested: {entry.Quantity}.");
            }
            else
            {
                // Deduct the stock
                product.Stock -= entry.Quantity;
            }
        }

        return errorResponse;
    }

    
    private class ErrorResponse
    {
        public List<string> Errors { get; set; } = new List<string>();
    }
}