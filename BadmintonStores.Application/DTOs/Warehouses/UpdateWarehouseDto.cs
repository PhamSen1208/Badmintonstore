namespace BadmintonStores.Application.DTOs.Warehouses;

public class UpdateWarehouseDto
{
    public int WarehouseId { get; set; }
    public string WarehouseName { get; set; } = string.Empty;
    public string? Address { get; set; }
}