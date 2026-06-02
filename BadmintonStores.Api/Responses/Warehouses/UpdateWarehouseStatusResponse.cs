namespace BadmintonStores.Api.Responses.Warehouses;

public class UpdateWarehouseStatusResponse
{
    public int WarehouseId { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? UpdatedAt { get; set; }
}