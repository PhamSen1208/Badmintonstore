namespace BadmintonStores.Application.DTOs.InventoryTransactions;

public class GetInventoryTransactionsResult
{
    public List<GetInventoryTransactionItemResult> Items { get; set; } = new();
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public int TotalItems { get; set; }
}

public class GetInventoryTransactionItemResult
{
    public int Id { get; set; }
    public string TransactionCode { get; set; } = string.Empty;
    public int WarehouseId { get; set; }
    public string WarehouseName { get; set; } = string.Empty;
    public int ProductVariantId { get; set; }
    public string SKU { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string TransactionType { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public int QuantityBefore { get; set; }
    public int QuantityAfter { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }
}