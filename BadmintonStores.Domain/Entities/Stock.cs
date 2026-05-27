namespace BadmintonStores.Domain.Entities;

public class Stock
{
    public int Id { get; set; }

    public int WarehouseId { get; set; }
    public int ProductVariantId { get; set; }

    public int Quantity { get; set; }
    public int ReservedQuantity { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public Warehouse Warehouse { get; set; } = null!;
    public ProductVariant ProductVariant { get; set; } = null!;
}