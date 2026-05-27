namespace BadmintonStores.Api.Responses.Orders;

public class GetOrdersResponse
{
    public List<GetOrderItemResponse> Items { get; set; } = new List<GetOrderItemResponse>();
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
}

public class GetOrderItemResponse
{
    public int OrderId { get; set; }
    public string OrderCode { get; set; } = null!;
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string PaymentStatus { get; set; } = null!;
    public decimal TotalAmount { get; set; }
    public DateTime OrderDate { get; set; }
}