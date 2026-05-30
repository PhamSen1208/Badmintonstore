namespace BadmintonStores.Application.DTOs.Stocks;

public class CreateStockDto
{
    public int WarehouseId { get; set; }
    public int ProductVariantId { get; set; }
    public int Quantity { get; set; }
}