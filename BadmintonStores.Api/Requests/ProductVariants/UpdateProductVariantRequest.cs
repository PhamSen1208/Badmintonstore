namespace BadmintonStores.Api.Requests.ProductVariants;

public class UpdateProductVariantRequest
{
    public decimal Price { get; set; }
    public decimal? SalePrice { get; set; }
    public string? Color { get; set; }
    public string? Size { get; set; }
    public decimal? Weight { get; set; }
}