namespace BadmintonStores.Application.DTOs.ProductReviews;

public class ProductReviewDto
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? CustomerAvatar { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int? OrderId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public bool IsVerifiedPurchase { get; set; }
    public DateTime CreatedAt { get; set; }
}
