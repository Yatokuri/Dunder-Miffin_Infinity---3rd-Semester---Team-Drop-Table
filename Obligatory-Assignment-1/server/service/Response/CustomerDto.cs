namespace service.Response;


public class CustomerDto
{
    public int Id { get; set; }                  
    public string Name { get; set; } = null!;     
    public string? Address { get; set; }           
    public string? Phone { get; set; }            
    public string? Email { get; set; }            
    public List<OrderDto> Orders { get; set; } = new List<OrderDto>(); 
}