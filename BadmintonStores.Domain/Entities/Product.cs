using BadmintonStores.Domain.Enums;

namespace BadmintonStores.Domain.Entities;

public class Product
{
    public int Id {get; set;}
    
    public string ProductCode {get; set;} = string.Empty;
    public string ProductName {get; set;} = string.Empty;
    
    public decimal BasePrice {get; set;}
    public string? Description {get; set;}
    public string? Warranty {get; set;} 

    public RecordStatus Status {get; set;} = RecordStatus.Active;

    public DateTime CreatedAt {get; set;}
    public DateTime UpdatedAt {get; set;}

    public ICollection<ProductVariant> Variants {get; set;} = new List<ProductVariant>();
}