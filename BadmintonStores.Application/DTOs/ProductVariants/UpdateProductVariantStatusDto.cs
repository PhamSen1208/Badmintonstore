namespace BadmintonStores.Application.DTOs.ProductVariants;

public class UpdateProductVariantStatusDto
{
    public int ProductVariantId {get; set;}
    public string Status {get; set;} = string.Empty;
}