using BadmintonStores.Api.Requests.Warehouses;
using BadmintonStores.Api.Responses;
using BadmintonStores.Api.Responses.Warehouses;
using BadmintonStores.Application.DTOs.Warehouses;
using BadmintonStores.Application.Interfaces;
using BadmintonStores.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace BadmintonStores.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WarehousesController : ControllerBase
{
    private readonly IWarehouseService _warehouseService;
    public WarehousesController(IWarehouseService warehouseService)
    {
        _warehouseService = warehouseService;
    }

    [HttpPost]
    public async Task<IActionResult> CraeteWarehouse([FromBody] CreateWarehouseRequest request, CancellationToken cancellationToken)
    {
        var dto = new CreateWarehouseDto
        {
            WarehouseCode = request.WarehouseCode,
            WarehouseName = request.WarehouseName,
            Address = request.Address
        };

        var result = await _warehouseService.CreateWarehouseAsync(dto,cancellationToken);

        var response = new CreateWarehouseResponse
        {
            WarehouseId = result.WarehouseId,
            WarehouseCode = result.WarehouseCode,
            WarehouseName = result.WarehouseName,
            Address = result.Address,
            Status = result.Status,
            CreatedAt = result.CreatedAt
        };
        return Ok(ApiResponse<CreateWarehouseResponse>.Ok(response,"Tạo kho hàng mới thành công"));
    }

    [HttpGet("{warehouseId:int}")]
    public async Task<IActionResult> GetWarehouseDetail(int warehouseId, CancellationToken cancellationToken)
    {
        var result = await _warehouseService.GetWarehouseByIdAsync(warehouseId, cancellationToken);
        var response = new GetWarehouseDetailResponse
        {
            WarehouseId = result.WarehouseId,
            WarehouseCode = result.WarehouseCode,
            WarehouseName = result.WarehouseName,
            Address = result.Address,
            Status = result.Status,
            CreatedAt = result.CreatedAt,
            UpdatedAt = result.UpdatedAt
        };
        return Ok(ApiResponse<GetWarehouseDetailResponse>.Ok(response,"Xem chi tiết kho hàng thành công"));
    }

    [HttpGet]
    public async Task<IActionResult> GetWarehouses([FromQuery] GetWarehousesRequest request,CancellationToken cancellationToken)
    {
        var query = new GetWarehousesQuery
        {
            Keyword = request.Keyword,
            Status = request.Status,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };

        var result = await _warehouseService.GetWarehousesAsync(query, cancellationToken);

        var response = new GetWarehousesResponse
        {
            Items = result.Items.Select(w => new GetWarehousesItemResponse
            {
                WarehouseId = w.WarehouseId,
                WarehouseCode = w.WarehouseCode,
                WarehouseName = w.WarehouseName,
                Address = w.Address,
                Status = w.Status,
                CreatedAt = w.CreatedAt,
                UpdatedAt = w.UpdatedAt
            }).ToList(),
            PageNumber = result.PageNumber,
            PageSize = result.PageSize,
            TotalItems = result.TotalItems,
            TotalPages = result.TotalPages
        };
        return Ok(ApiResponse<GetWarehousesResponse>.Ok(response,"Lấy danh sách kho hàng thành công"));
    }

    [HttpPatch("{warehouseId:int}")]
    public async Task<IActionResult> UpdateWarehouse([FromRoute] int warehouseId, [FromBody] UpdateWarehouseDto request, CancellationToken cancellationToken)
    {
        var dto = new UpdateWarehouseDto
        {
            WarehouseId = warehouseId,
            WarehouseName = request.WarehouseName,
            Address = request.Address
        };

        var result = await _warehouseService.UpdateWarehouseAsync(dto, cancellationToken);
        var response = new UpdateWarehouseResponse
        {
            WarehouseId = result.WarehouseId,
            WarehouseCode = result.WarehouseCode,
            WarehouseName = result.WarehouseName,
            Address = result.Address,
            Status = result.Status,
            CreatedAt = result.CreatedAt,
            UpdatedAt = result.UpdatedAt
        };
        return Ok(ApiResponse<UpdateWarehouseResponse>.Ok(response,"Cập nhật kho hàng thành công"));
    }

    [HttpPatch("{warehouseId:int}/status")]
    public async Task<IActionResult> UpdateWarehouseStatus([FromRoute] int warehouseId, [FromBody] UpdateWarehouseStatusRequest request, CancellationToken cancellationToken)
    {
        var dto = new UpdateWarehouseStatusDto
        {
            WarehouseId = warehouseId,
            Status = request.Status
        };

        var result = await _warehouseService.UpdateWarehouseStatusAsync(dto, cancellationToken);
        var response = new UpdateWarehouseStatusResponse
        {
            WarehouseId = result.WarehouseId,
            Status = result.Status,
            UpdatedAt = result.UpdatedAt  
        };
        return Ok(ApiResponse<UpdateWarehouseStatusResponse>.Ok(response,"Cập nhật trạng thái kho hàng thành công"));
    }
}