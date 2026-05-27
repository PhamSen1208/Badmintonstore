namespace BadmintonStores.Application.DTOs.Products;

public class UpdateProductStatusResult
{
    public int ProductId {get; set;}
    public string ProductCode {get; set;} = string.Empty;
    public string Status {get; set;} = string.Empty;
    public DateTime UpdatedAt {get; set;}
}