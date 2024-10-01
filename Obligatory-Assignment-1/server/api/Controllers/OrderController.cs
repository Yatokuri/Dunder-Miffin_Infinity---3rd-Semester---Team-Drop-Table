using dataAccess;
using dataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using service.Request.OrderDto;
using service.Request.OrderEntryDto;
using service.Response;

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
    public ActionResult<OrderDto> GetOrderById(int id)
    {
        var orderEntity = context.Orders
            .Include(o => o.OrderEntries) // Include order entries
            .ThenInclude(oe => oe.Product) // Include product details for each order entry
            .FirstOrDefault(o => o.Id == id);

        if (orderEntity == null)
        {
            return NotFound();
        }

        // Manually map the Order entity to OrderDto
        var orderDto = new OrderDto
        {
            Id = orderEntity.Id,
            OrderDate = orderEntity.OrderDate,
            DeliveryDate = orderEntity.DeliveryDate,
            Status = orderEntity.Status,
            TotalAmount = orderEntity.TotalAmount,
            CustomerId = orderEntity.CustomerId,
            OrderEntries = orderEntity.OrderEntries.Select(oe => new OrderEntryDto
            {
                Id = oe.Id,
                Quantity = oe.Quantity,
                ProductId = oe.ProductId,
            }).ToList()
        };

        return Ok(orderDto); // Return the DTO with a 200 OK status
    }
    

    
    // Create a new order
    [HttpPost]
    [Route("api/order")]
    public ActionResult<OrderDto> CreateOrder([FromBody] OrderRequestDto orderRequestDto)
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

        var stockUpdateResult = UpdateStockLevels(orderRequestDto.OrderEntries, null);
        if (stockUpdateResult.Errors.Count > 0) 
        {
            return BadRequest(stockUpdateResult); // Return any error from stock update
        }

        context.Orders.Add(order);
        context.SaveChanges();

        // Convert the saved order entity to OrderDto
        var orderDto = new OrderDto
        {
            Id = order.Id,
            OrderDate = order.OrderDate,
            DeliveryDate = order.DeliveryDate,
            Status = order.Status,
            TotalAmount = order.TotalAmount,
            CustomerId = order.CustomerId,
            OrderEntries = order.OrderEntries.Select(oe => new OrderEntryDto
            {
                Id = oe.Id,
                ProductId = oe.ProductId,
                Quantity = oe.Quantity,
            }).ToList()
        };

        // Return the OrderDto with CreatedAtAction
        return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, orderDto);
    }

    [HttpPut]
    [Route("api/order/{id}")]
    public ActionResult<OrderDto> UpdateOrder(int id, [FromBody] OrderRequestDto orderDto)
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
        orderEntity.TotalAmount = orderDto.Order.TotalAmount; // Ensure frontend sends this

        // Update order entries if provided in the DTO
        var restockEntries = new Dictionary<int, int>();

            // Update order entries
            foreach (var orderEntryDto in orderDto.OrderEntries)
            {
                var orderEntryEntity = orderEntity.OrderEntries
                    .FirstOrDefault(oe => oe.ProductId == orderEntryDto.ProductId);

                if (orderEntryEntity != null)
                {
                    // If quantity is zero, remove the order entry and restock the product
                    if (orderEntryDto.Quantity == 0)
                    {
                        // Track restock quantity before removal
                        int productId = orderEntryEntity.ProductId.GetValueOrDefault();
                        if (productId != 0)
                        {
                            restockEntries[productId] = orderEntryEntity.Quantity; // Keep track for restocking
                        }
                        context.OrderEntries.Remove(orderEntryEntity); // Remove the entry
                    }
                    else
                    {
                        // Update existing entry quantity
                        restockEntries[orderEntryEntity.ProductId.GetValueOrDefault()] = orderEntryEntity.Quantity;
                        orderEntryEntity.Quantity = orderEntryDto.Quantity;
                    }
                }
                else
                {
                    // Add new entry if it doesn't exist
                    if (orderEntryDto.Quantity > 0)
                    {
                        var newOrderEntry = new OrderEntry
                        {
                            ProductId = orderEntryDto.ProductId,
                            Quantity = orderEntryDto.Quantity,
                        };
                        orderEntity.OrderEntries.Add(newOrderEntry);
                    }
                }
            }

        // Handle stock levels
        var stockUpdateResult = UpdateStockLevels(orderDto.OrderEntries, restockEntries);
        if (stockUpdateResult.Errors.Count > 0)
        {
            return BadRequest(stockUpdateResult); // Return stock update errors if any
        }

        context.SaveChanges(); 

        // Return the updated order as a DTO
        var orderResponseDto = new OrderDto
        {
            Id = orderEntity.Id,
            OrderDate = orderEntity.OrderDate,
            DeliveryDate = orderEntity.DeliveryDate,
            Status = orderEntity.Status,
            TotalAmount = orderEntity.TotalAmount,
            CustomerId = orderEntity.CustomerId,
            OrderEntries = orderEntity.OrderEntries.Select(oe => new OrderEntryDto
            {
                Id = oe.Id,
                ProductId = oe.ProductId,
                Quantity = oe.Quantity,
            }).ToList()
        };

        return Ok(orderResponseDto);
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

        if (orderEntity.Status != "Cancelled") // If order already Cancelled restock has being done
        {
            // Re-add the stock for each product in the order entries
            foreach (var orderEntry in orderEntity.OrderEntries)
            {
                var product = context.Papers.FirstOrDefault(p => p.Id == orderEntry.ProductId);
                if (product != null)
                {
                    product.Stock += orderEntry.Quantity; // Restock the product
                }
            }

        }

        // Remove the orders and its entries from the database
        context.OrderEntries.RemoveRange(orderEntity.OrderEntries);
        context.Orders.Remove(orderEntity);
        context.SaveChanges();

        return Ok();
    }
    
    // Method for updating stock levels with restocking
    private ErrorResponse UpdateStockLevels(List<CreateOrderEntryDto> orderEntries, Dictionary<int, int>? restockEntries)
    {
        var errorResponse = new ErrorResponse();

        // Create a list of products to deduct stock from
        var productIdsToDeduct = orderEntries
            .Where(entry => entry.Quantity > 0) // Only consider entries with positive quantities
            .Select(entry => entry.ProductId)
            .Distinct()
            .ToList();

            // Deduct stock for the existing quantities
            foreach (var entry in orderEntries)
            {
                var product = context.Papers.Find(entry.ProductId);

                if (product == null)
                {
                    errorResponse.Errors.Add($"Product with ID {entry.ProductId} not found.");
                    continue; // Skip to the next product
                }

                // If the product is in the deduction list, check and deduct stock
                if (productIdsToDeduct.Contains(entry.ProductId) && entry.Quantity > 0)
                {
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
            }

            // Restock the quantities for products that were removed
            foreach (var restockEntry in restockEntries ?? new Dictionary<int, int>())
            {
                var product = context.Papers.Find(restockEntry.Key); 
                if (product != null)
                {
                    product.Stock += restockEntry.Value; // Restock the product
                }
            }

            // Return error response only if there are errors
            return errorResponse;
        }

    
    private class ErrorResponse
    {
        public List<string> Errors { get; set; } = new List<string>();
    }
}