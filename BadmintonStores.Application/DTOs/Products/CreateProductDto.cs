namespace BadmintonStores.Application.DTOs.Products;

public class CreateProductDto
{
    public string ProductCode {get; set;} = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public string? Description { get; set; }
    public string? Warranty { get; set; }
}
