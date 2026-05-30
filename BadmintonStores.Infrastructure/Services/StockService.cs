using BadmintonStores.Application.Common.Exceptions;
using BadmintonStores.Application.DTOs.Stocks;
using BadmintonStores.Application.Interfaces;
using BadmintonStores.Domain.Entities;
using BadmintonStores.Domain.Enums;
using BadmintonStores.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BadmintonStores.Infrastructure.Services;

public class StockService : IStockService
{
    private readonly AppDbContext _dbContext;

    public StockService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<GetWarehouseStocksResult> GetWarehouseStocksAsync(int warehouseId, CancellationToken cancellationToken = default)
    {
        if(warehouseId <= 0 )
        {
            throw new ValidationException("INVALID_WAREHOUSE_ID", "WarehouseId không hợp lệ");
        }

        var warehouse = await _dbContext.Warehouses.FirstOrDefaultAsync(w => w.Id == warehouseId, cancellationToken);
        if(warehouse == null)
        {
            throw new NotFoundException("WAREHOUSE_NOT_FOUND", "Không tìm thấy kho");
        }

        //Lấy danh sách stock theo warehouseId từ request, rồi lấy kèm thông tin cần thiết của productVariant và Product
        var items = await _dbContext.Stocks
            .Where(s => s.WarehouseId == warehouseId)
            .Include(s => s.ProductVariant)
            .ThenInclude(v => v.Product)
            .Select(s => new StockResult
            {
                StockId = s.Id,
                WarehouseId = s.WarehouseId,
                WarehouseCode = warehouse.WarehouseCode,
                WarehouseName = warehouse.WarehouseName,
                ProductVariantId = s.ProductVariantId,
                SKU = s.ProductVariant.SKU,
                ProductName = s.ProductVariant.Product.ProductName,
                Quantity = s.Quantity,
                ReservedQuantity = s.ReservedQuantity,
                UpdatedAt = s.UpdatedAt

            }).ToListAsync(cancellationToken);

        return new GetWarehouseStocksResult
        {
            WarehouseId = warehouse.Id,
            WarehouseCode = warehouse.WarehouseCode,
            WarehouseName = warehouse.WarehouseName,
            Items = items
        };
    }

    public async Task<StockResult> CreateStockAsync(CreateStockDto request, CancellationToken cancellationToken)
    {
        ValidateCreate(request);
        var warehouseExists = await _dbContext.Warehouses.AnyAsync(w => w.Id == request.WarehouseId, cancellationToken);
        if(!warehouseExists)
        {
            throw new NotFoundException("WAREHOUSE_NOT_FOUND", "Không tìm thấy kho");
        }
        var variantExists = await _dbContext.ProductVariants.AnyAsync(v => v.Id == request.ProductVariantId, cancellationToken);
        if(!variantExists)
        {
            throw new NotFoundException("WAREHOUSE_NOT_FOUND", "Không tìm thấy kho");
        }
        var stockExists =  await _dbContext.Stocks.AnyAsync(s => s.WarehouseId == request.WarehouseId && s.ProductVariantId == request.ProductVariantId, cancellationToken);
        if (stockExists)
        {
            throw new ValidationException("STOCK_ALREADY_EXISTS", "Tồn kho cho sản phẩm này trong kho đã tồn tại");
        }

        await using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);

        var stock = new Stock
        {
            WarehouseId = request.WarehouseId,
            ProductVariantId = request.ProductVariantId,
            Quantity = request.Quantity,
            ReservedQuantity = 0,
            UpdatedAt = DateTime.UtcNow
        };

        _dbContext.Stocks.Add(stock);
        await _dbContext.SaveChangesAsync(cancellationToken);

          _dbContext.InventoryTransactions.Add(new InventoryTransaction
        {
            TransactionCode = await GenerateInventoryTransactionCodeAsync(cancellationToken),
            WarehouseId = request.WarehouseId,
            ProductVariantId = request.ProductVariantId,
            TransactionType = InventoryTransactionType.Adjustment,
            Quantity = request.Quantity,
            QuantityBefore = 0,
            QuantityAfter = request.Quantity,
            ReferenceType = InventoryReferenceType.StockAdjustment,
            ReferenceId = stock.Id,
            Note = "Initial stock",
            CreatedAt = DateTime.UtcNow
        });

        await _dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return await GetStockResultAsync(stock.Id, cancellationToken);    
    }

    public async Task<StockResult> UpdateStockQuantityAsync(UpdateStockQuantityDto request, CancellationToken cancellationToken = default)
    {
        if (request.StockId <= 0)
            throw new ValidationException("INVALID_STOCK_ID", "StockId không hợp lệ");

        if (request.Quantity < 0)
            throw new ValidationException("INVALID_QUANTITY", "Quantity không được nhỏ hơn 0");

        var stock = await _dbContext.Stocks.FirstOrDefaultAsync(s => s.Id == request.StockId, cancellationToken);
        if (stock == null)
            throw new NotFoundException("STOCK_NOT_FOUND", "Không tìm thấy tồn kho");

        var now = DateTime.UtcNow;
        var quantityBefore = stock.Quantity;
        var quantityAfter = request.Quantity;
        var changedQuantity = quantityAfter - quantityBefore;

        await using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);

        stock.Quantity = quantityAfter;
        stock.UpdatedAt = now;

        _dbContext.InventoryTransactions.Add(new InventoryTransaction
        {
            TransactionCode = await GenerateInventoryTransactionCodeAsync(cancellationToken),
            WarehouseId = stock.WarehouseId,
            ProductVariantId = stock.ProductVariantId,
            TransactionType = InventoryTransactionType.Adjustment,
            Quantity = changedQuantity,
            QuantityBefore = quantityBefore,
            QuantityAfter = quantityAfter,
            ReferenceType = InventoryReferenceType.StockAdjustment,
            ReferenceId = stock.Id,
            Note = request.Note,
            CreatedAt = now
        });

        await _dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return await GetStockResultAsync(stock.Id, cancellationToken);
    }

    private async Task<StockResult> GetStockResultAsync(int stockId, CancellationToken cancellationToken)
    {
        var stock = await _dbContext.Stocks
            .Include(s => s.Warehouse)
            .Include(s => s.ProductVariant)
            .ThenInclude(v => v.Product)
            .FirstAsync(s => s.Id == stockId, cancellationToken);

        return new StockResult
        {
            StockId = stock.Id,
            WarehouseId = stock.WarehouseId,
            WarehouseCode = stock.Warehouse.WarehouseCode,
            WarehouseName = stock.Warehouse.WarehouseName,
            ProductVariantId = stock.ProductVariantId,
            SKU = stock.ProductVariant.SKU,
            ProductName = stock.ProductVariant.Product.ProductName,
            Quantity = stock.Quantity,
            ReservedQuantity = stock.ReservedQuantity,
            UpdatedAt = stock.UpdatedAt
        };
    }

    private static void ValidateCreate(CreateStockDto request)
    {
        if (request.WarehouseId <= 0)
            throw new ValidationException("INVALID_WAREHOUSE_ID", "WarehouseId không hợp lệ");

        if (request.ProductVariantId <= 0)
            throw new ValidationException("INVALID_PRODUCT_VARIANT_ID", "ProductVariantId không hợp lệ");

        if (request.Quantity < 0)
            throw new ValidationException("INVALID_QUANTITY", "Quantity không được nhỏ hơn 0");
    }

    private async Task<string> GenerateInventoryTransactionCodeAsync(CancellationToken cancellationToken)
    {
        var count = await _dbContext.InventoryTransactions.CountAsync(cancellationToken);
        return $"INV{count + 1:000000}";
    }

}