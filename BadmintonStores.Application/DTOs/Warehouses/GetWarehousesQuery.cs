namespace BadmintonStores.Application.DTOs.Warehouses;

public class GetWarehousesQuery
{
    public string? Keyword { get; set; }
    public string? Status { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}