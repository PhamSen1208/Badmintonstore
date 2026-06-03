using BadmintonStores.Application.Common.Exceptions;
using BadmintonStores.Application.DTOs.Warehouses;
using BadmintonStores.Application.Interfaces;
using BadmintonStores.Domain.Entities;
using BadmintonStores.Domain.Enums;
using BadmintonStores.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BadmintonStores.Infrastructure.Services;

public class WarehouseService : IWarehouseService
{
    private readonly AppDbContext _dbContext;

    public WarehouseService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CreateWarehouseResult> CreateWarehouseAsync (CreateWarehouseDto request, CancellationToken cancellationToken)
    {
        ValidateRequest(request);
        var warehouseCodeExists = await _dbContext.Warehouses.AnyAsync(w => w.WarehouseCode == request.WarehouseCode, cancellationToken);
        if(warehouseCodeExists)
        {
            throw new ValidationException("WAREHOUSE_CODE_EXISTS", "Mã nhà kho đã tồn tại");
        }

        var warehouse = new Warehouse
        {
            WarehouseCode = request.WarehouseCode.Trim(),
            WarehouseName = request.WarehouseName.Trim(),
            Address = request.Address,
            Status = RecordStatus.Active,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Warehouses.Add(warehouse);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new CreateWarehouseResult
        {
            WarehouseId = warehouse.Id,
            WarehouseCode = warehouse.WarehouseCode,
            WarehouseName = warehouse.WarehouseName,
            Address = warehouse.Address,
            Status = warehouse.Status.ToString().ToLowerInvariant(),
            CreatedAt = warehouse.CreatedAt
        };
    }

    public async Task<GetWarehouseDetailResult> GetWarehouseByIdAsync(int warehouseId, CancellationToken cancellationToken)
    {
        if(warehouseId <= 0)
        {
            throw new ValidationException("WAREHOUSE_ID_INVALID", "Mã nhà kho không hợp lệ");     
        }

        var warehouse = await _dbContext.Warehouses.FirstOrDefaultAsync(w => w.Id == warehouseId, cancellationToken);
        if(warehouse == null)
        {
            throw new NotFoundException("WAREHOUSE_NOT_FOUND", "Nhà kho không tồn tại");
        }

        return new GetWarehouseDetailResult
        {
            WarehouseId = warehouse.Id,
            WarehouseCode = warehouse.WarehouseCode,
            WarehouseName = warehouse.WarehouseName,
            Address = warehouse.Address,
            Status = warehouse.Status.ToString().ToLowerInvariant(),
            CreatedAt = warehouse.CreatedAt,
            UpdatedAt = warehouse.UpdatedAt
        };
    }

    public async Task<GetWarehousesResult> GetWarehousesAsync(GetWarehousesQuery request, CancellationToken cancellationToken)
    {
        var pageNumber = request.PageNumber <= 0 ? 1 : request.PageNumber;
        var pageSize = request.PageSize <= 0 ? 20 : request.PageSize;

        if(pageSize > 100)
        {
            pageSize = 100;
        }

        var query = _dbContext.Warehouses.AsQueryable();
        if(!string.IsNullOrWhiteSpace(request.Keyword))
        {
            var keyword = request.Keyword.Trim();

            query = query.Where(w => 
            w.WarehouseCode.Contains(keyword) ||
            w.WarehouseName.Contains(keyword) ||
            (w.Address != null && w.Address.Contains(keyword)));
        }

        if(!string.IsNullOrWhiteSpace(request.Status))
        {
            var status = ParseRecordStatus(request.Status);
            query = query.Where(w => w.Status == status);
        }
        var totalItems = await query.CountAsync(cancellationToken);
        var totalPages = (int)Math.Ceiling(totalItems/(double)pageSize);

        var items = await query
            .OrderByDescending(w => w.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(w => new GetWarehousesItemResult
            {
                WarehouseId = w.Id,
                WarehouseCode = w.WarehouseCode,
                WarehouseName = w.WarehouseName,
                Address = w.Address,
                Status = w.Status.ToString().ToLowerInvariant(),
                CreatedAt = w.CreatedAt,
                UpdatedAt = w.UpdatedAt
            }).ToListAsync(cancellationToken);

        return new GetWarehousesResult
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalPages
        };
    }

    public async Task<UpdateWarehouseResult> UpdateWarehouseAsync (UpdateWarehouseDto request, CancellationToken cancellationToken)
    {
        if(request.WarehouseId <= 0)
        {
            throw new ValidationException("INVALID_WAREHOUSE_ID", "WarehouseId không hợp lệ");
        }
        if(string.IsNullOrWhiteSpace(request.WarehouseName))
        {
            throw new ValidationException("WAREHOUSE_NAME_REQUIRED", "Tên kho hàng là bắt buộc");
        }

        var warehouse = await _dbContext.Warehouses.FirstOrDefaultAsync(w => w.Id == request.WarehouseId, cancellationToken);

        if(warehouse == null)
        {
            throw new NotFoundException("WAREHOUSE_NOT_FOUND", "Không tìm thấy kho hàng");
        }

        warehouse.WarehouseName = request.WarehouseName.Trim();
        warehouse.Address = request.Address?.Trim();
        warehouse.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new UpdateWarehouseResult
        {
            WarehouseId = warehouse.Id,
            WarehouseCode = warehouse.WarehouseCode,  
            WarehouseName = warehouse.WarehouseName,
            Address = warehouse.Address,
            Status = warehouse.Status.ToString().ToLowerInvariant(),
            CreatedAt = warehouse.CreatedAt,
            UpdatedAt = warehouse.UpdatedAt
        };
    }

    public async Task<UpdateWarehouseStatusResult> UpdateWarehouseStatusAsync (UpdateWarehouseStatusDto request, CancellationToken cancellationToken)
    {
        if(request.WarehouseId <= 0)
        {
            throw new ValidationException("INVALID_WAREHOUSE_ID", "WarehouseId không hợp lệ");
        }

        var warehouse = await _dbContext.Warehouses.FirstOrDefaultAsync(w => w.Id == request.WarehouseId, cancellationToken );

        if(warehouse == null)
        {
            throw new NotFoundException("WAREHOUSE_NOT_FOUND", "Kho hàng không tồn tại");
        }
        warehouse.Status = ParseRecordStatus(request.Status);
        warehouse.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new UpdateWarehouseStatusResult
        {
            WarehouseId = warehouse.Id,
            Status = warehouse.Status.ToString().ToLowerInvariant(),
            UpdatedAt = warehouse.UpdatedAt  
        };
    }

    private static void ValidateRequest(CreateWarehouseDto request)
    {
        if(string.IsNullOrWhiteSpace(request.WarehouseCode))
        {
            throw new ValidationException("WAREHOUSE_CODE_REQUIRE", "Mã kho chứa là bắt buộc");
        }
        if(string.IsNullOrWhiteSpace(request.WarehouseName))
        {
            throw new ValidationException("WAREHOUSE_NAME_REQUIRE", "Tên kho chứa là bắt buộc");
        }
         if (request.WarehouseCode.Length > 50)
        {
            throw new ValidationException("WAREHOUSE_CODE_TOO_LONG", "Mã kho hàng quá dài");
        }
        if (request.WarehouseName.Length > 255)
        {
            throw new ValidationException("WAREHOUSE_NAME_TOO_LONG", "Tên kho hàng quá dài");
        }
    }

    private static RecordStatus ParseRecordStatus(string status)
    {
        return status.Trim().ToLowerInvariant() switch
        {
            "active" => RecordStatus.Active,
            "inactive" => RecordStatus.Inactive,
            _ => throw new ValidationException("INVALID_WAREHOUSE_STATUS", "Trạng thái của kho hàng chưa được hỗ trợ")
        };
    }
}