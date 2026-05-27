namespace BadmintonStores.Application.DTOs.Orders;

public class UpdateOrderNoteResult
{
    public int OrderId { get; set; }
    public string OrderCode { get; set; } = string.Empty;
    public string? Note { get; set; }
}