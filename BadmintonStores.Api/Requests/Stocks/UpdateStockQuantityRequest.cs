namespace BadmintonStores.Api.Requests.Stocks;

public class UpdateStockQuantityRequest
{
    public int Quantity { get; set; }
    public string? Note { get; set; }
}