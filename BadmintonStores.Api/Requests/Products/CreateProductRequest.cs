namespace BadmintonStores.Api.Requests.Products;

public class CreateProductRequest
{
    public string ProductCode { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public int? CategoryId { get; set; }
    public int? BrandId { get; set; }
    public string? Description { get; set; }
    public string? Warranty { get; set; } 
}