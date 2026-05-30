namespace BadmintonStores.Application.DTOs.ProductVariants;

public class GetProductVariantsQuery
{
    public int ProductId { get; set; }
    public string? Keyword { get; set; }
    public string? Status { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}