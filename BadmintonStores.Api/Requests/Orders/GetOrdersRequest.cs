namespace BadmintonStores.Api.Requests.Orders;

public class GetOrdersRequest
{
    public int? CustomerId { get; set; }
    public string? PaymentStatus { get; set; }
    public string? Status { get; set; }

    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}