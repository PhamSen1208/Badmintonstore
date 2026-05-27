namespace BadmintonStores.Application.DTOs.Orders;

public class CancelOrderResponse
{
    public int OrderId { get; set; }
    public string OrderCode { get; set; } = null!;
    public string Status { get; set; } = null!;
}