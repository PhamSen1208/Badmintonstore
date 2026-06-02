namespace BadmintonStores.Application.DTOs.Warehouses;

public class UpdateWarehouseStatusDto
{
    public int WarehouseId { get; set; }
    public string Status { get; set; } = string.Empty;
}