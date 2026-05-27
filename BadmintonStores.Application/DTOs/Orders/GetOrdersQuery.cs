namespace BadmintonStores.Application.DTOs.Orders;

public class GetOrdersQuery
{
    public int? CustomerId { get; set; }
    public string? Status { get; set; }
    public string? PaymentStatus { get; set; }

    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}