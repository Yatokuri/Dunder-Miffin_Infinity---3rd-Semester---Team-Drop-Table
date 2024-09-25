namespace API.DTOs
{
    public class OrderRequestDTO
    {
        public CustomerDto Customer { get; set; } // Use a DTO for customer
        public OrderDto Order { get; set; }       // Use a DTO for order
    }

    public class CustomerDto
    {
        public int Id { get; set; } 
        public string Name { get; set; } 
        public string Address { get; set; } 
        public string Phone { get; set; } 
        public string Email { get; set; } 
    }

    public class OrderDto
    {
        public DateTime OrderDate { get; set; }
        public DateOnly? DeliveryDate { get; set; }
        public string Status { get; set; }
        public double TotalAmount { get; set; }
        public int CustomerId { get; set; }
        public List<OrderEntryDto> OrderEntries { get; set; } = new List<OrderEntryDto>();
    }

    public class OrderEntryDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}