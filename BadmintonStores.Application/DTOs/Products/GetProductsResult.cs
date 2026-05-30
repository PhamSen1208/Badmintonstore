namespace BadmintonStores.Application.DTOs.Products;

public class GetProductsResult
{
    public List<GetProductsItemResult> Items {get; set;} = new();

    public int PageNumber {get; set;}
    public int PageSize {get; set;}
    public int TotalItems {get; set;}
    public int TotalPages {get ; set;}
}

public class GetProductsItemResult
{
    public int ProductId {get; set;} 
    public string ProductName {get; set;} = string.Empty;
    public string ProductCode {get; set;} = string.Empty;
    public decimal BasePrice {get; set;} 
    public string Status {get; set;} = string.Empty;
    public DateTime CreatedAt {get; set;}
    public DateTime UpdatedAt {get; set;}

}