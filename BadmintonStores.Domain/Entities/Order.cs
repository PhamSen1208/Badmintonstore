using BadmintonStores.Domain.Enums;

namespace BadmintonStores.Domain.Entities;

public class Order
{
    public int Id { get; set; }

    public string OrderCode { get; set; } = string.Empty;

    public int CustomerId { get; set; }

    public DateTime OrderDate { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Confirmed;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Unpaid;

    public decimal Subtotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal TotalAmount { get; set; }

    public string? Note { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Customer Customer { get; set; } = null!;
    public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>(); // 1 order có thể có nhiều order detail
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    public ICollection<InventoryTransaction> InventoryTransactions { get; set; } = new List<InventoryTransaction>();
}