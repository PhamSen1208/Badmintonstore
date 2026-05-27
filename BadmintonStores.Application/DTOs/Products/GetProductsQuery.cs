namespace BadmintonStores.Application.DTOs.Products;

public class GetProductsQuery
{
    public string? Keyword {get; set;}
    public string? Status {get; set;}
    public int PageNumber {get; set;}
    public int PageSize {get; set;}
}
