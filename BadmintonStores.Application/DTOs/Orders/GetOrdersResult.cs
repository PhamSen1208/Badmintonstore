namespace BadmintonStores.Application.DTOs.Orders;

public class GetOrdersResult
{
    public List<GetOrdersItemResult> Items { get; set; } = new();

    public int PageNumber {get; set;}
    public int PageSize {get; set;}
    public int TotalItems {get; set;}
    public int TotalPages {get; set;}
}

public class GetOrdersItemResult
{
    public int OrderId { get; set; }
    public string OrderCode { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;

    public decimal TotalAmount { get; set; }
    public DateTime OrderDate { get; set; }
}