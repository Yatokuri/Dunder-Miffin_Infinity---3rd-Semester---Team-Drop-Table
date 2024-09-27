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

        public OrderController(OrderService service, CustomerService customerService)
        {
            _service = service; 
            _customerService = customerService; 
        }

        // Create Order
        [Route("/api/fullOrder")]
        [HttpPost]
        public IActionResult CreateFullOrder([FromBody] OrderRequestDto orderRequestDto)
        {
            // Check if the customer exists
            var existingCustomer = _customerService.GetCustomerByEmail(orderRequestDto.Customer.Email);

            // Use existing customer or create a new one
            var customerId = existingCustomer?.Id ?? _customerService.CreateCustomer(new Customer
            {
                Name = orderRequestDto.Customer.Name,
                Address = orderRequestDto.Customer.Address,
                Phone = orderRequestDto.Customer.Phone,
                Email = orderRequestDto.Customer.Email
            }).Id;


            // Create the order from the DTO
            var order = new Order
            {
                OrderDate = orderRequestDto.Order.OrderDate.ToUniversalTime(),
                DeliveryDate = orderRequestDto.Order.DeliveryDate,
                Status = orderRequestDto.Order.Status,
                TotalAmount = orderRequestDto.Order.TotalAmount,
                CustomerId = customerId, // Use the correct customer ID
                OrderEntries = orderRequestDto.Order.OrderEntries.Select(entry => new OrderEntry
                {
                    ProductId = entry.ProductId,
                    Quantity = entry.Quantity
                }).ToList()
            };

            // Save the order using your order service
            var newOrder = _service.CreateOrder(order);

            // Return the created order with its URI
            return CreatedAtAction(nameof(CreateFullOrder), new { id = newOrder.Id }, newOrder);
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