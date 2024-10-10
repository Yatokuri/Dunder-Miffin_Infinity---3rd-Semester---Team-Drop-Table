using dataAccess.Models;
using FluentValidation;
using service.Request;

namespace Service.Validators
{
    public class PaperValidator : AbstractValidator<string>
    {
        public PaperValidator()
        {

        }
    }
    public class CreatePaperValidator : AbstractValidator<CreatePaperDto>
    {
        public CreatePaperValidator()
        {
            RuleFor(paper => paper.name)
                .NotEmpty().WithMessage("Name cannot be empty.");

            RuleFor(paper => paper.price)
                .NotEmpty().WithMessage("Price cannot be empty.")
                .GreaterThanOrEqualTo(1).WithMessage("Order Date cannot be in the future.");

            RuleFor(paper => paper.stock)
                .NotEmpty().WithMessage("Stock cannot be empty")
                .GreaterThanOrEqualTo(0).WithMessage("Stock must be greater than or equal to 0.");
        }
    }

    public class UpdatePaperValidator : AbstractValidator<EditPaperDto>
    {
        public UpdatePaperValidator()
        {
            RuleFor(order => order.Status)
                .NotEmpty().WithMessage("Status cannot be empty.");

            /*  RuleFor(order => order.DeliveryDate)
                  .NotEmpty().WithMessage("Delivery Date cannot be empty.")
                  .GreaterThan(DateTime.UtcNow.Date).WithMessage("Delivery Date must be in the future."); */
        }
    }
}