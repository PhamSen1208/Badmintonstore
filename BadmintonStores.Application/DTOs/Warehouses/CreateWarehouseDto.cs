namespace BadmintonStores.Application.DTOs.Warehouses;

public class CreateWarehouseDto
{
    public string WarehouseCode {get; set;} = string.Empty;
    public string WarehouseName {get ;set;} = string.Empty;
    public string? Address {get; set;}
}