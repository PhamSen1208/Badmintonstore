namespace BadmintonStores.Api.Requests.Customers;

public class GetCustomersRequest
{
    public string? Keyword { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}