using dataAccess.Models;

namespace service
{
    public class MyOrderService
    {
        public List<Order> MyOrders { get; set; } = new List<Order>();

        public List<Order> GetAllOrders()
        {
            return MyOrders;
        }
        
        public Order AddOrder(Order order)
        {
            MyOrders.Add(order);
            return order;
        }
    }
}