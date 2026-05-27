namespace BadmintonStores.Api.Requests.Products;

public class UpdateProductRequest
{
    public string ProductName {get; set;} = string.Empty;
    public decimal BasePrice {get; set;}
    public string? Description {get; set;}
    public string? Warranty {get; set;}
}