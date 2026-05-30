namespace BadmintonStores.Api.Requests.ProductVariants;

public class GetProductVariantsRequest
{
    public string? Keyword { get; set; }
    public string? Status { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}