using dataAccess.Models;
using dataAccess;

namespace service
{
    public class CustomerService
    {
        private readonly DMIContext _context;

        public CustomerService(DMIContext context)
        {
            _context = context;
        }

        // Create
        public Customer CreateCustomer(Customer customer)
        {
            _context.Customers.Add(customer);
            _context.SaveChanges();
            return customer;
        }

        // Read All
        public IEnumerable<Customer> GetAllCustomers()
        {
            return _context.Customers.ToList();
        }

        // Read by ID
        public Customer GetCustomerById(int id)
        {
            return _context.Customers.Find(id);
        }

        // Update
        public Customer UpdateCustomer(int id, Customer customer)
        {
            var existingCustomer = _context.Customers.Find(id);
            if (existingCustomer == null) return null;

            existingCustomer.Name = customer.Name;
            existingCustomer.Address = customer.Address;
            existingCustomer.Email = customer.Email;
            existingCustomer.Phone = customer.Phone;

            _context.SaveChanges();
            return existingCustomer;
        }

        // Delete
        public bool DeleteCustomer(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return false;

            _context.Customers.Remove(customer);
            _context.SaveChanges();
            return true;
        }
    }
}