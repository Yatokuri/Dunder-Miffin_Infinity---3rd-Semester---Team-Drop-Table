using dataAccess.Models;
using dataAccess;

namespace service
{
    public class OrderService
    {
        private readonly DMIContext _context;

        public OrderService(DMIContext context)
        {
            _context = context;
        }

        // Create
        public Order CreateOrder(Order order)
        {
            _context.Orders.Add(order);
            _context.SaveChanges();
            return order;
        }

        // Read All
        public IEnumerable<Order> GetAllOrders()
        {
            return _context.Orders.ToList();
        }

        // Read by ID
        public Order GetOrderById(int id)
        {
            return _context.Orders.Find(id);
        }

        // Update
        public Order UpdateOrder(int id, Order order)
        {
            var existingOrder = _context.Orders.Find(id);
            if (existingOrder == null) return null;

            existingOrder.Status = order.Status;
            existingOrder.DeliveryDate = order.DeliveryDate;
            existingOrder.TotalAmount = order.TotalAmount;
            _context.SaveChanges();

            return existingOrder;
        }

        // Delete
        public bool DeleteOrder(int id)
        {
            var order = _context.Orders.Find(id);
            if (order == null) return false;

            _context.Orders.Remove(order);
            _context.SaveChanges();
            return true;
        }
    }
}
