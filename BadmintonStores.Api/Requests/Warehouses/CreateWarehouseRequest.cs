namespace BadmintonStores.Api.Requests.Warehouses;

public class CreateWarehouseRequest
{
    public string WarehouseName {get; set;} = string.Empty;
    public string WarehouseCode {get; set;} = string.Empty;
    public string? Address {get; set;} 
}