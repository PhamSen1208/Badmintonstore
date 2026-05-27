using BadmintonStores.Domain.Enums;

namespace BadmintonStores.Domain.Entities;

public class Warehouse
{
    public int Id {get; set;}

    public string WarehouseCode {get; set;} = string.Empty;
    public string WarehouseName {get ; set;} = string.Empty;
    public string? Address {get ; set;} = string.Empty;

    public RecordStatus Status {get; set;} = RecordStatus.Active;

    public DateTime CreatedAt {get ; set;}
    public DateTime? UpdatedAt {get ; set;}

    public ICollection<Stock> Stocks {get; set;} = new List<Stock>();
    public ICollection<InventoryTransaction> InventoryTransactions {get; set;} = new List<InventoryTransaction> (); 

}