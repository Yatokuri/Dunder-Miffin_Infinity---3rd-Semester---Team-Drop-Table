using System.Security.Claims;
using dataAccess; // Ensure this is your actual namespace for the DbContext
using Microsoft.EntityFrameworkCore; // Required for Include and EF Core methods

namespace api.helpers // Replace with your actual namespace
{
    public class AuthorizationHelper
    {
        private readonly DMIContext _context; // Your actual DbContext
        private readonly ClaimsPrincipal _user;

        public AuthorizationHelper(DMIContext context, ClaimsPrincipal user)
        {
            _context = context;
            _user = user;
        }

        public bool IsUserOwnOrder(int orderId)
        {
            // Get the user ID from claims
            var userId = _user.FindFirstValue("UserId");

            // Check if the user is an admin
            var isAdmin = _user.IsInRole("Admin");

            // Retrieve the order entity
            var orderEntity = _context.Orders
                .Include(o => o.Customer) // Eager load the Customer property
                .FirstOrDefault(o => o.Id == orderId);

            // Check if the order exists and if the user is the owner
            var isOwner = orderEntity?.Customer != null && orderEntity.Customer.Id.ToString() == userId;

            return isAdmin || isOwner;
        }
    }
}