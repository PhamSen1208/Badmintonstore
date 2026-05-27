using BadmintonStores.Domain.Enums;

namespace BadmintonStores.Domain.Entities;

public class Payment
{
    public int Id { get; set; }

    public string PaymentCode { get; set; } = string.Empty;

    public int OrderId { get; set; }

    public decimal Amount { get; set; }

    public PaymentMethod PaymentMethod { get; set; }
    public PaymentStatus PaymentStatus { get; set; }

    public string? TransactionId { get; set; }
    public DateTime? PaidAt { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Order Order { get; set; } = null!;
}