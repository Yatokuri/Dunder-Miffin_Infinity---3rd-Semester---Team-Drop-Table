using FluentValidation;

namespace Service.Validators
{
    public class OrderStatusValidator : AbstractValidator<string>
    {
        public OrderStatusValidator()
        {
            // Define valid statuses use the same as the OrderStatusAtoms
            var validStatuses = new[] { "Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned" };

            RuleFor(status => status)
                .NotEmpty()
                .Must(status => validStatuses.Contains(status));
        }
    }
}