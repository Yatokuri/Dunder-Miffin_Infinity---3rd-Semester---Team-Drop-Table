using Microsoft.AspNetCore.Mvc;
using dataAccess.Models;
using service;

namespace api.Controllers
{
    [ApiController]
    [Route("api/order-entry")]
    public class OrderEntryController : ControllerBase
    {
        private readonly OrderEntryService _service;

        public OrderEntryController(OrderEntryService service)
        {
            _service = service;
        }

        // Create Order Entry
        [HttpPost]
        public ActionResult<OrderEntry> AddOrderEntry([FromBody] OrderEntry entry)
        {
            var newEntry = _service.AddOrderEntry(entry);
            return Ok(newEntry);
        }

        // Get All Order Entries
        [HttpGet]
        public ActionResult<IEnumerable<OrderEntry>> GetAllOrderEntries()
        {
            var entries = _service.GetAllOrderEntries();
            return Ok(entries);
        }

        // Get Order Entry by ID
        [HttpGet("{id}")]
        public ActionResult<OrderEntry> GetOrderEntryById(int id)
        {
            var entry = _service.GetOrderEntryById(id);
            if (entry == null) return NotFound();
            return Ok(entry);
        }

        // Update Order Entry
        [HttpPut("{id}")]
        public ActionResult<OrderEntry> UpdateOrderEntry(int id, [FromBody] OrderEntry entry)
        {
            var updatedEntry = _service.UpdateOrderEntry(id, entry);
            if (updatedEntry == null) return NotFound();
            return Ok(updatedEntry);
        }

        // Delete Order Entry
        [HttpDelete("{id}")]
        public ActionResult DeleteOrderEntry(int id)
        {
            var deleted = _service.DeleteOrderEntry(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}