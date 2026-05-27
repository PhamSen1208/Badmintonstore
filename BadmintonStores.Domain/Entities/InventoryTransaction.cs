using BadmintonStores.Domain.Enums;

namespace BadmintonStores.Domain.Entities;

public class InventoryTransaction
{
    public int Id { get; set; }

    public string TransactionCode { get; set; } = string.Empty;

    public int WarehouseId { get; set; }
    public int ProductVariantId { get; set; }

    public InventoryTransactionType TransactionType { get; set; }

    public int Quantity { get; set; }
    public int QuantityBefore { get; set; }
    public int QuantityAfter { get; set; }

    public InventoryReferenceType ReferenceType { get; set; }
    public int ReferenceId { get; set; }

    public int? OrderId { get; set; }
    public int? OrderDetailId { get; set; }

    public string? Note { get; set; }
    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public Warehouse Warehouse { get; set; } = null!; // 1 transaction chỉ liên quan đến 1 kho
    public ProductVariant ProductVariant { get; set; } = null!; // 1 transaction chỉ liên quan đến 1 biến thể sản phẩm
    public Order? Order { get; set; } // 1 transaction có thể liên quan đến 1 order, nhưng không bắt buộc
    public OrderDetail? OrderDetail { get; set; } // 1 transaction có thể liên quan đến 1 order detail, nhưng không bắt buộc
}