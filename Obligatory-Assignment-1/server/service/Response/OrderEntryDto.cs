namespace service.Response;

public class OrderEntryDto
{
    public int Id { get; set; }
    public int Quantity { get; set; }
    public int? ProductId { get; set; }
    public PaperDto? Paper { get; set; }
}