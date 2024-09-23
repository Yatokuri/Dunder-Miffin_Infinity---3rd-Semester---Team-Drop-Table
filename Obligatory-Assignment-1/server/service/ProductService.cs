using dataAccess.Models;

namespace service
{
    public class ProductService
    {
        public List<Product> MyProducts { get; set; } = new List<Product>();

        public List<Product> GetAllProducts()
        {
            return MyProducts;
        }
        
        public Product AddProduct(Product product)
        {
            MyProducts.Add(product);
            return product;
        }
    }
}