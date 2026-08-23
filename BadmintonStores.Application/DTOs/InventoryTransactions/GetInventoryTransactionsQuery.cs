namespace BadmintonStores.Application.DTOs.InventoryTransactions;

public class GetInventoryTransactionsQuery
{
    public int? WarehouseId { get; set; }
    public int? ProductVariantId { get; set; }
    public string? TransactionType { get; set; }

    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
