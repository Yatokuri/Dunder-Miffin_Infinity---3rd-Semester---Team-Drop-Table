using dataAccess.Models;
using dataAccess;

namespace service
{
    public class OrderEntryService
    {
        private readonly DMIContext _context;

        public OrderEntryService(DMIContext context)
        {
            _context = context;
        }

        // Create
        public OrderEntry AddOrderEntry(OrderEntry entry)
        {
            _context.OrderEntries.Add(entry);
            _context.SaveChanges();
            return entry;
        }
        
        public void AddOrderEntries(IEnumerable<OrderEntry> entries)
        {
            _context.OrderEntries.AddRange(entries); // Adds multiple entries at once
            _context.SaveChanges(); // Save all changes in one go
        }


        // Read All
        public IEnumerable<OrderEntry> GetAllOrderEntries()
        {
            return _context.OrderEntries.ToList();
        }

        // Read by ID
        public OrderEntry GetOrderEntryById(int id)
        {
            return _context.OrderEntries.Find(id);
        }

        // Update
        public OrderEntry UpdateOrderEntry(int id, OrderEntry entry)
        {
            var existingEntry = _context.OrderEntries.Find(id);
            if (existingEntry == null) return null;

            existingEntry.Quantity = entry.Quantity;
            existingEntry.ProductId = entry.ProductId;
            existingEntry.OrderId = entry.OrderId;
            _context.SaveChanges();

            return existingEntry;
        }

        // Delete
        public bool DeleteOrderEntry(int id)
        {
            var entry = _context.OrderEntries.Find(id);
            if (entry == null) return false;

            _context.OrderEntries.Remove(entry);
            _context.SaveChanges();
            return true;
        }
    }
}