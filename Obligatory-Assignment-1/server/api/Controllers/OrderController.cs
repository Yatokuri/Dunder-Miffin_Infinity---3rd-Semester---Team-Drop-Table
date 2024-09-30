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
        var stockUpdateResult = UpdateStockLevels(orderRequestDto.OrderEntries);
        if (stockUpdateResult is not null) 
        {
            return stockUpdateResult; // Return any error from stock update
        }

        // Add the order to the context
        context.Orders.Add(order);
        context.SaveChanges(); // Save changes to the database

        return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
        
    }
    
    [HttpPut]
    [Route("api/order/{id}")]
    public ActionResult<Order> UpdateOrder(int id, [FromBody] OrderRequestDto orderDto)
    {
        // Find the order in the database including its order entries
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
                    // If the order entry exists, update the quantity
                    orderEntryEntity.Quantity = orderEntryDto.Quantity; // Assuming you have Quantity to update
                    // You can add more fields to update if needed
                }
                else
                {
                    // Optionally, handle the case where the order entry does not exist
                    // For example, you could create a new order entry
                    var newOrderEntry = new OrderEntry
                    {
                        ProductId = orderEntryDto.ProductId,
                        Quantity = orderEntryDto.Quantity,
                        // Set any additional properties here as necessary
                    };
                    orderEntity.OrderEntries.Add(newOrderEntry);
                }
            }

            // Check and update stock levels after order entries have been processed
            var stockUpdateResult = UpdateStockLevels(orderDto.OrderEntries);
            if (stockUpdateResult is not null) 
            {
                return stockUpdateResult; // Return any error from stock update
            }
        }

        context.SaveChanges(); // Save all changes to the database
        return Ok(orderEntity); // Return the updated order entity
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
    
    [HttpDelete] // Use DELETE for canceling the order
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

    private ActionResult? UpdateStockLevels(List<CreateOrderEntryDto> orderEntries)
    {
        foreach (var entry in orderEntries)
        {
            var  product = context.Papers.FirstOrDefault(p => p.Id == entry.ProductId);
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

        return null;
    }
    
}