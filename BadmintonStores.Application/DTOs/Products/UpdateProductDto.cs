namespace BadmintonStores.Application.DTOs.Products;

public class UpdateProductDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public string? Description { get; set; }
    public string? Warranty { get; set; }
}