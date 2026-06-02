namespace BadmintonStores.Application.DTOs.Warehouses;

public class UpdateWarehouseStatusResult
{
    public int WarehouseId { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? UpdatedAt { get; set; }
}