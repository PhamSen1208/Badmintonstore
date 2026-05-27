namespace BadmintonStores.Domain.Entities;

public class OrderDetail
{
    public int Id { get; set; }

    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public int ProductVariantId { get; set; }

    public string ProductName { get; set; } = string.Empty;
    public string? VariantName { get; set; }
    public string SKU { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal LineTotal { get; set; }

    public DateTime CreatedAt { get; set; }

    public Order Order { get; set; } = null!;
}