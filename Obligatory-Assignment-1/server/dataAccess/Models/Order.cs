namespace dataAccess.Models;

public class Order
{
    public DateTime OrderDate { get; set; }
    public DateOnly DeliveryDate { get; set; }
    public String Status { get; set; }
    public double TotalAmount { get; set; }
    public int CustomerId { get; set; }
    public int OrderId { get; set; }
}