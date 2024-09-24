using dataAccess.Models;

namespace service
{
    public class AllOrdersService
    {
        public List<Order> AllOrders { get; set; } = new List<Order>();

        public List<Order> GetAllOrders()
        {
            return AllOrders;
        }
        
        public Order AddOrder(Order order)
        {
            AllOrders.Add(order);
            return order;
        }
    }
}