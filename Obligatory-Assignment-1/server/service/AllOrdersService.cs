using dataAccess;
using dataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace service
{
    public class AllOrdersService
    {
        private readonly DMIContext _context;

        public AllOrdersService(DMIContext context)
        {
            _context = context;
        }
        
        public List<Order> MyOrders { get; set; } = new List<Order>();

        public async Task<List<Order>> GetAllOrdersAsync()
        {
            return await _context.Orders
                .Include(o => o.Customer)           // Include Customer details
                .Include(o => o.OrderEntries)       // Include OrderEntries
                .ToListAsync();
        }
        
        public Order AddOrder(Order order)
        {
            MyOrders.Add(order);
            return order;
        }
    }
}