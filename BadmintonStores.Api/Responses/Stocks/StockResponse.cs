namespace BadmintonStores.Api.Responses.Stocks;

public class StockResponse
{
    public int StockId { get; set; }
    public int WarehouseId { get; set; }
    public string WarehouseCode { get; set; } = string.Empty;
    public string WarehouseName { get; set; } = string.Empty;
    public int ProductVariantId { get; set; }
    public string SKU { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public int ReservedQuantity { get; set; }
    public DateTime? UpdatedAt { get; set; }
}