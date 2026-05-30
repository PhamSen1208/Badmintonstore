namespace BadmintonStores.Application.DTOs.ProductVariants;

public class UpdateProductVariantResult
{
    public int ProductVariantId { get; set; }
    public int ProductId { get; set; }
    public string ProductCode { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;

    public string SKU { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? SalePrice { get; set; }
    public string? Color { get; set; }
    public string? Size { get; set; }
    public decimal? Weight { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}