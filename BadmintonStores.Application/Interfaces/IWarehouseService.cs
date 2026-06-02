using BadmintonStores.Application.DTOs.Warehouses;

namespace BadmintonStores.Application.Interfaces;

public interface IWarehouseService
{
    Task<CreateWarehouseResult> CreateWarehouseAsync(CreateWarehouseDto request, CancellationToken cancellationToken = default);
    Task<GetWarehouseDetailResult> GetWarehouseByIdAsync(int warehouseId, CancellationToken cancellationToken = default);
    Task<GetWarehousesResult> GetWarehousesAsync(GetWarehousesQuery request, CancellationToken cancellationToken = default);
    Task<UpdateWarehouseResult> UpdateWarehouseAsync(UpdateWarehouseDto request, CancellationToken cancellationToken = default);
    Task<UpdateWarehouseStatusResult> UpdateWarehouseStatusAsync(UpdateWarehouseStatusDto request, CancellationToken cancellationToken = default);
}