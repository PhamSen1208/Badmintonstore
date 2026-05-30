namespace BadmintonStores.Api.Requests.Stocks;

public class CreateStockRequest
{
    public int WarehouseId { get; set; }
    public int ProductVariantId { get; set; }
    public int Quantity { get; set; }
}