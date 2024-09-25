using API.DTOs;
using Microsoft.AspNetCore.Mvc;
using dataAccess.Models;
using service;

namespace api.Controllers
{
    [ApiController]
    [Route("api/order")]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _service;
        private readonly CustomerService _customerService;
        private readonly OrderEntryService _orderEntryService;

        public OrderController(OrderService service, CustomerService customerService, OrderEntryService orderEntryService)
        {
            _service = service; 
            _customerService = customerService; 
            _orderEntryService = orderEntryService;
        }

        // Create Order
        [Route("api/fullOrder")]
        [HttpPost]
        public IActionResult CreateFullOrder([FromBody] OrderRequestDTO orderRequestDto)
        {
            // Check if the customer exists
            var existingCustomer = _customerService.GetCustomerById(orderRequestDto.Customer.Id);

            if (existingCustomer == null)
            {
                // Create a new customer if not found
                var newCustomer = new Customer
                {
          
                    Name = orderRequestDto.Customer.Name,
                    Address = orderRequestDto.Customer.Address,
                    Phone = orderRequestDto.Customer.Phone,
                    Email = orderRequestDto.Customer.Email
                };

                // Add the new customer to the database
                _customerService.CreateCustomer(newCustomer);

                // You might want to update the existingCustomer variable
                existingCustomer = newCustomer;
            }

            // Create the order from the DTO
            var order = new Order
            {
                OrderDate = orderRequestDto.Order.OrderDate,
                DeliveryDate = orderRequestDto.Order.DeliveryDate,
                Status = orderRequestDto.Order.Status,
                TotalAmount = orderRequestDto.Order.TotalAmount,
                CustomerId = orderRequestDto.Customer.Id // Use the customer ID from the DTO
            };

            // Save the order using your order service
            var newOrder = _service.CreateOrder(order);

            // Create and save order entries using your order entry service
            foreach (var entry in orderRequestDto.Order.OrderEntries)
            {
                var orderEntry = new OrderEntry
                {
                    ProductId = entry.ProductId,
                    Quantity = entry.Quantity,
                    OrderId = newOrder.Id
                };

                // Use the OrderEntryService to add the order entry
                _orderEntryService.AddOrderEntry(orderEntry);
            }

            return CreatedAtAction(nameof(CreateOrder), new { id = newOrder.Id }, newOrder);
        }
    
        // Create Order
        [HttpPost]
        public ActionResult<Order> CreateOrder([FromBody] Order order)
        {
            var newOrder = _service.CreateOrder(order);
            return Ok(newOrder);
        }

        // Get All Orders
        [HttpGet]
        public ActionResult<IEnumerable<Order>> GetAllOrders()
        {
            var orders = _service.GetAllOrders();
            return Ok(orders);
        }

        // Get Order by ID
        [HttpGet("{id}")]
        public ActionResult<Order> GetOrderById(int id)
        {
            var order = _service.GetOrderById(id);
            if (order == null) return NotFound();
            return Ok(order);
        }

        // Update Order
        [HttpPut("{id}")]
        public ActionResult<Order> UpdateOrder(int id, [FromBody] Order order)
        {
            var updatedOrder = _service.UpdateOrder(id, order);
            if (updatedOrder == null) return NotFound();
            return Ok(updatedOrder);
        }

        // Delete Order
        [HttpDelete("{id}")]
        public ActionResult DeleteOrder(int id)
        {
            var deleted = _service.DeleteOrder(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}