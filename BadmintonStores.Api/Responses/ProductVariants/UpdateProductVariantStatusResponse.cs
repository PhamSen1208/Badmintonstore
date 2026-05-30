namespace BadmintonStores.Api.Responses.ProductVariants;

public class UpdateProductVariantStatusResponse
{
    public int ProductVariantId {get; set;}
    public string Status {get; set;} = string.Empty;
    public DateTime? UpdatedAt {get; set;}
}