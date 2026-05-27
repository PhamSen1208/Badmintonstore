namespace BadmintonStores.Api.Responses.Products;

public class UpdateProductResponse
{
    public int ProductId {get; set;}
    public string ProductName {get; set;} = string.Empty;
    public string ProductCode {get; set;} = string.Empty;
    public decimal BasePrice {get; set;}
    public string? Description {get; set;}
    public string? Warranty {get; set;}
    public string Status {get; set;} = string.Empty;
    public DateTime UpdatedAt {get; set;}
}