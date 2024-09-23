namespace dataAccess.Models;

public class Product
{
    public int Id { get; set; }
    public String Name { get; set; }
    public bool Discontinued { get; set; }
    public int Stock { get; set; }
    public float Price { get; set; }
    
}