namespace service.Request;

public class EditPaperDto
{
    public int Id { get; set; }
    public string name { get; set; } = null!;
    public int stock { get; set; }
    public int price { get; set; }
}