namespace BadmintonStores.Api.Requests.Warehouses;

public class UpdateWarehouseRequest
{
    public string WarehouseName { get; set; } = string.Empty;
    public string? Address { get; set; }
}