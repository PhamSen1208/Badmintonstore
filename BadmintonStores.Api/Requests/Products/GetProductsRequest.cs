namespace BadmintonStores.Api.Requests.Products;

public class GetProductsRequest
{
    public int? Keyword {get; set;}
    public string? Status {get; set;}
    public int PageNumber {get; set;}
    public int PageSize {get; set;}

}