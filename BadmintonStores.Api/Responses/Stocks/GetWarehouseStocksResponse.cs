namespace BadmintonStores.Api.Responses.Stocks;

public class GetWarehouseStocksResponse
{
    public int WarehouseId { get; set; }
    public string WarehouseCode { get; set; } = string.Empty;
    public string WarehouseName { get; set; } = string.Empty;
    public List<StockResponse> Items { get; set; } = new();
}