namespace BadmintonStores.Application.DTOs.ProductVariants;

public class CreateProductVariantResult
{
    public int ProductVariantId {get; set;}
    public int ProductId {get; set;}
    public string SKU {get; set;} = string.Empty;
    public decimal Price {get; set;}
    public decimal? SalePrice {get; set;}
    public decimal? Weight {get; set;}
    public string? Color {get; set;}
    public string? Size {get; set;}
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt {get; set;}
}