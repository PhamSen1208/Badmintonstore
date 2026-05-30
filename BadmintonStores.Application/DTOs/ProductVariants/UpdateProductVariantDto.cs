namespace BadmintonStores.Application.DTOs.ProductVariants;

public class UpdateProductVariantDto
{
    public int ProductVariantId {get; set;}
    public decimal? Weight {get; set;}
    public decimal Price {get; set;}
    public decimal? SalePrice {get; set;}
    public string? Color {get; set;}
    public string? Size {get; set;}  
}