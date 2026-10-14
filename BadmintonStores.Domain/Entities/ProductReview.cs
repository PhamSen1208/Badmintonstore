namespace BadmintonStores.Domain.Entities;

public class ProductReview
{
    public int Id { get; set; }

    public int CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public int? OrderId { get; set; }
    public Order? Order { get; set; }

    public int Rating { get; set; } // Số sao từ 1 đến 5
    public string Comment { get; set; } = string.Empty;

    public bool IsVerifiedPurchase { get; set; } = false; // Đã mua hàng thực tế

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
