namespace BadmintonStores.Application.DTOs.Products;

public class GetProductDetailResult
{
    public int ProductId {get; set;}
    public string ProductCode {get ; set;} = string.Empty;
    public string ProductName {get; set;} = string.Empty;
    public decimal BasePrice {get; set;}
    public string? Description { get; set; }
    public string? Warranty { get; set; }
    public string Status { get; set; } = string.Empty;

    public int? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public int? BrandId { get; set; }
    public string? BrandName { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

}