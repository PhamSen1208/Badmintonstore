namespace BadmintonStores.Application.DTOs.ProductVariants;

public class GetProductVariantsResult
{
    public int ProductId { get; set; }
    public string ProductCode { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;

    public List<GetProductVariantsItemResult> Items { get; set; } = new();

    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
}

public class GetProductVariantsItemResult
{
    public int ProductVariantId { get; set; }
    public string SKU { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? SalePrice { get; set; }
    public decimal? Weight { get; set; }
    public string? Color { get; set; }
    public string? Size { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}