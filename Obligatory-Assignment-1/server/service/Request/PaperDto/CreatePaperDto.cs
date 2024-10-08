namespace service.Request;

public class CreatePaperDto
{
    public string name { get; set; } = null!;
    public int stock { get; set; }
    public int price { get; set; }
}