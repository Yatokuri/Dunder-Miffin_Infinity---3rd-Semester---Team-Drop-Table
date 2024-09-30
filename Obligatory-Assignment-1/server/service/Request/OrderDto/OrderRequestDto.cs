using service.Request.CustomerDto;
using service.Request.OrderEntryDto;

namespace service.Request.OrderDto;

public class OrderRequestDto
{
    public CreateCustomerDto Customer { get; set; }  // Customer details
    public CreateOrderDto Order { get; set; }        // Order details
    public List<CreateOrderEntryDto> OrderEntries { get; set; }
}