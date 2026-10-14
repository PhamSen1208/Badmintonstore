namespace BadmintonStores.Application.DTOs.WishList;

public class WishListItemDto {
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? BrandName { get; set; }
    public string? CategoryName { get; set; }
    public string? PrimaryImageUrl { get; set; }
    public decimal BasePrice { get; set; }
    public DateTime AddedAt { get; set; }
}