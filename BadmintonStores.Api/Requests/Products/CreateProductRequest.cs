namespace BadmintonStores.Api.Requests.Products;

public class CreateProductRequest
{
    public string ProductCode { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public string? Description { get; set; }
    public string? Warranty { get; set; } 
}