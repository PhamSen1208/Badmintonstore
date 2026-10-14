namespace BadmintonStores.Application.DTOs.Orders;

public class UpdatePaymentStatusResult
{
    public int OrderId { get; set; }
    public string OrderCode { get; set; } = null!;
    public string PaymentStatus { get; set; } = null!;
}
