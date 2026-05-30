namespace BadmintonStores.Application.DTOs.ProductVariants;

public class UpdateProductVariantStatusResult
{
    public int ProductVariantId {get; set;}
    public string Status {get; set;} = string.Empty;
    public DateTime? UpdatedAt {get; set;}
}