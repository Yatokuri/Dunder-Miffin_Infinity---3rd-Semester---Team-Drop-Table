using FluentValidation;
using service.Request.OrderDto;

namespace Service.Validators;


public class CreateOrderValidator : AbstractValidator<OrderRequestDto>
{
    public CreateOrderValidator()
    {
        RuleFor(order => order.Order.Status)
            .NotEmpty().WithMessage("Status cannot be empty.");

        RuleFor(order => order.Order.OrderDate)
            .NotEmpty().WithMessage("Order Date cannot be empty.")
            .LessThanOrEqualTo(DateTime.Now).WithMessage("Order Date cannot be in the future.");

        RuleFor(order => order.OrderEntries)
            .NotEmpty().WithMessage("Order must have at least one entry.");
    }
}

public class UpdateOrderValidator : AbstractValidator<OrderRequestDto>
{
    public UpdateOrderValidator()
    {
        RuleFor(order => order.Order.Status)
            .NotEmpty().WithMessage("Status cannot be empty.");
        
        RuleFor(order => order.Order.OrderDate)
            .NotNull().WithMessage("Order Date cannot be empty.");
        
        RuleFor(order => order.OrderEntries)
            .NotEmpty().WithMessage("Order must have at least one entry.");
        
        RuleFor(order => order.Order.DeliveryDate)
            .NotNull().WithMessage("Delivery Date cannot be empty.")
            .GreaterThan(DateTime.UtcNow.ToShortDateString()).WithMessage("Delivery Date must be in the future.");
    }
}

public class OrderStatusValidator : AbstractValidator<string>
{
    public OrderStatusValidator()
    {
        // Define valid statuses using the same as the OrderStatusAtoms
        var validStatuses = new[] { "Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned" };

        RuleFor(status => status)
            .NotEmpty()
            .Must(status => validStatuses.Contains(status));
    }
}