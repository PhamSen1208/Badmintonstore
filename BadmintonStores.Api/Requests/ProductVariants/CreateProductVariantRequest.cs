namespace BadmintonStores.Api.Requests.ProductVariants;

public class CreateProductVariantRequest
{
    public string SKU {get; set;} = string.Empty;
    public decimal Price {get; set;}
    public decimal? SalePrice {get; set;}
    public decimal? Weight {get; set;}
    public string? Color {get; set;}
    public string? Size {get; set;}
}