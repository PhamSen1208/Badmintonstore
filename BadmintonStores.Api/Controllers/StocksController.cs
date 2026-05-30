using BadmintonStores.Api.Requests.Stocks;
using BadmintonStores.Api.Responses;
using BadmintonStores.Api.Responses.Stocks;
using BadmintonStores.Application.DTOs.Stocks;
using BadmintonStores.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BadmintonStores.Api.Controllers;

[ApiController]
[Route("api")]
public class StocksController : ControllerBase
{
    private readonly IStockService _stockService;

    public StocksController(IStockService stockService)
    {
        _stockService = stockService;
    }

    [HttpGet("warehouses/{warehouseId:int}/stocks")]
    public async Task<IActionResult> GetWarehouseStocks(int warehouseId, CancellationToken cancellationToken)
    {
        var result = await _stockService.GetWarehouseStocksAsync(warehouseId, cancellationToken);

        var response = new GetWarehouseStocksResponse
        {
            WarehouseId = result.WarehouseId,
            WarehouseCode = result.WarehouseCode,
            WarehouseName = result.WarehouseName,
            Items = result.Items.Select(MapStockResponse).ToList()
        };

        return Ok(ApiResponse<GetWarehouseStocksResponse>.Ok(response, "Lấy danh sách tồn kho thành công"));
    }

    [HttpPost("stocks")]
    public async Task<IActionResult> CreateStock([FromBody] CreateStockRequest request, CancellationToken cancellationToken)
    {
        var dto = new CreateStockDto
        {
            WarehouseId = request.WarehouseId,
            ProductVariantId = request.ProductVariantId,
            Quantity = request.Quantity
        };

        var result = await _stockService.CreateStockAsync(dto, cancellationToken);
        return Ok(ApiResponse<StockResponse>.Ok(MapStockResponse(result), "Tạo tồn kho thành công"));
    }

    [HttpPatch("stocks/{stockId:int}")]
    public async Task<IActionResult> UpdateStockQuantity(
        int stockId,
        [FromBody] UpdateStockQuantityRequest request,
        CancellationToken cancellationToken)
    {
        var dto = new UpdateStockQuantityDto
        {
            StockId = stockId,
            Quantity = request.Quantity,
            Note = request.Note
        };

        var result = await _stockService.UpdateStockQuantityAsync(dto, cancellationToken);
        return Ok(ApiResponse<StockResponse>.Ok(MapStockResponse(result), "Cập nhật tồn kho thành công"));
    }

    private static StockResponse MapStockResponse(StockResult result)
    {
        return new StockResponse
        {
            StockId = result.StockId,
            WarehouseId = result.WarehouseId,
            WarehouseCode = result.WarehouseCode,
            WarehouseName = result.WarehouseName,
            ProductVariantId = result.ProductVariantId,
            SKU = result.SKU,
            ProductName = result.ProductName,
            Quantity = result.Quantity,
            ReservedQuantity = result.ReservedQuantity,
            UpdatedAt = result.UpdatedAt
        };
    }
}