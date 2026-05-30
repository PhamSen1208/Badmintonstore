using BadmintonStores.Domain.Enums;

namespace BadmintonStores.Domain.Entities;

public class ProductVariant
{
    public int Id {get; set;}
    public int ProductId {get; set;}

    public string SKU {get; set;} = string.Empty;

    public decimal Price {get; set;}
    public decimal? SalePrice {get; set;}
    public decimal? Weight {get; set;}
        public string? Color { get; set; }
    public string? Size { get; set; }

    public RecordStatus Status {get; set;} = RecordStatus.Active;
    public DateTime CreatedAt {get; set;}
    public DateTime? UpdatedAt {get; set;}

    public Product Product {get; set;} = null!; // 1 Product có thể có nhiều ProductVariant, nhưng mỗi ProductVariant chỉ thuộc về 1 Product
    public ICollection<Stock> Stocks {get; set;} = new List<Stock>();
}