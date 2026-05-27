namespace BadmintonStores.Api.Requests.Orders;
public class UpdateOrderNoteResponse
{
    public int OrderId { get; set; }
    public string OrderCode { get; set; } = null!;
    public string? Note { get; set; }
}