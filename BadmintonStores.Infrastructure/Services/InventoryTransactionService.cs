using BadmintonStores.Application.DTOs.InventoryTransactions;
using BadmintonStores.Application.Interfaces;
using BadmintonStores.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BadmintonStores.Infrastructure.Services;

public class InventoryTransactions : IInventoryTransactionService
{
    private readonly AppDbContext _dbContext;
    
    public InventoryTransactions(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<GetInventoryTransactionsResult> GetTransactionsAsync(GetInventoryTransactionsQuery query, CancellationToken cancellationToken = default)
    {
        var dbQuery = _dbContext.InventoryTransactions
            .Include(t => t.Warehouse)
            .Include(t => t.ProductVariant)
            .ThenInclude(t => t.Product)
            .AsNoTracking();

            //Lọc theo kho
        if(query.WarehouseId.HasValue && query.WarehouseId.Value > 0)
        {
            dbQuery = dbQuery.Where(t => t.WarehouseId == query.WarehouseId.Value);
        }

        //Lọc theo biến thể sản phẩm
        if(query.ProductVariantId.HasValue && query.ProductVariantId.Value > 0)
        {
            dbQuery = dbQuery.Where(t => t.ProductVariantId == query.ProductVariantId.Value);
        }

        var totalItems = await dbQuery.CountAsync(cancellationToken);
        var totalPages = (int)Math.Ceiling(totalItems/(double)query.PageSize);
            
        var items = await dbQuery
            .OrderByDescending(t => t.CreatedAt)
            .Skip((query.PageNumber-1)*query.PageSize)
            .Take(query.PageSize)
            .Select(t => new GetInventoryTransactionItemResult
            {
                Id = t.Id,
                TransactionCode = t.TransactionCode,
                WarehouseId = t.WarehouseId,
                WarehouseName = t.Warehouse.WarehouseName,
                ProductVariantId = t.ProductVariantId,
                SKU = t.ProductVariant.SKU,
                ProductName = t.ProductVariant.Product.ProductName,
                TransactionType = t.TransactionType.ToString().ToLower(),
                Quantity = t.Quantity,
                QuantityBefore = t.QuantityBefore,
                QuantityAfter = t.QuantityAfter,
                Note = t.Note,
                CreatedAt = t.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        return new GetInventoryTransactionsResult
        {
            Items = items,
            PageNumber = query.PageNumber,
            PageSize = query.PageSize,
            TotalItems = totalItems,
            TotalPages = totalPages
        };  
    }
}