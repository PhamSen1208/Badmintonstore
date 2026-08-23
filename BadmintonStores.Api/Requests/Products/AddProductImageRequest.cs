namespace BadmintonStores.Api.Requests.Products;

public class AddProductImageRequest
{
    public int ProductId { get; set; }
    public int? ProductVariantId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
    public int DisplayOrder { get; set; }
}
