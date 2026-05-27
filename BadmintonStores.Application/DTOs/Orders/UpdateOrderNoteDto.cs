namespace BadmintonStores.Application.DTOs.Orders;

public class UpdateOrderNoteDto
{
    public int OrderId { get; set; }
    public string? Note { get; set; }
}