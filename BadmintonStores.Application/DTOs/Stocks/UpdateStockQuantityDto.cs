namespace BadmintonStores.Application.DTOs.Stocks;

public class UpdateStockQuantityDto
{
    public int StockId { get; set; }
    public int Quantity { get; set; }
    public string? Note { get; set; }
}