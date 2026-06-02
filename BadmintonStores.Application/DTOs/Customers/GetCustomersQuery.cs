namespace BadmintonStores.Application.DTOs.Customers;

public class GetCustomersQuery
{
    public string? Keyword { get; set; }
    public string? Status { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}