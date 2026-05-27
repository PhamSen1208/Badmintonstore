namespace BadmintonStores.Api.Responses.Products;

public class GetProductsResponse
{
    public List<GetProductsItemResponse> Items {get; set;} = new();

    public int PageNumber {get; set;}
    public int pageSize {get; set;}
    public int TotalItems {get; set;}
    public int TotalPages {get ; set;}
}

public class GetProductsItemResponse
{
    public int ProductId {get; set;} 
    public string ProductName {get; set;} = string.Empty;
    public string ProductCode {get; set;} = string.Empty;
    public decimal BasePrice {get; set;} 
    public string Status {get; set;} = string.Empty;
    public DateTime CreatedAt {get; set;}
    public DateTime UpdatedAt {get; set;}
}
