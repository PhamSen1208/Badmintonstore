namespace BadmintonStores.Application.DTOs.Stocks;

public class GetWarehouseStocksResult
{
    public int WarehouseId { get; set; }
    public string WarehouseCode { get; set; } = string.Empty;
    public string WarehouseName { get; set; } = string.Empty;
    public List<StockResult> Items { get; set; } = new();
}