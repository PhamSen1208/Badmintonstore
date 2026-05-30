using BadmintonStores.Application.DTOs.Stocks;

namespace BadmintonStores.Application.Interfaces;

public interface IStockService
{
    Task<GetWarehouseStocksResult> GetWarehouseStocksAsync(int warehouseId, CancellationToken cancellationToken = default);
    Task<StockResult> CreateStockAsync(CreateStockDto request, CancellationToken cancellationToken = default);
    Task<StockResult> UpdateStockQuantityAsync(UpdateStockQuantityDto request, CancellationToken cancellationToken = default);
}