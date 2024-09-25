using dataAccess;
using dataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace service
{
    public class MyOrderService
    {
        private readonly DMIContext _context;

        public MyOrderService(DMIContext context)
        {
            _context = context;
        }
        
        public List<Order> MyOrders { get; set; } = new List<Order>();
        
        public async Task<List<Order>> GetOrdersByCustomerIdAsync(int customerId)
        {
            return await _context.Orders
                .Where(o => o.CustomerId == customerId) // Filter by CustomerId
                .Include(o => o.Customer)               // Include Customer details
                .Include(o => o.OrderEntries)           // Include OrderEntries
                .ToListAsync();
        }
        
        public Order AddOrder(Order order)
        {
            MyOrders.Add(order);
            return order;
        }
    }
}