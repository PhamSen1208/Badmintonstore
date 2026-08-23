namespace BadmintonStores.Domain.Entities;

public class Brand
{
    public int Id { get; set; }
    public string BrandCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public ICollection<Product> Products { get; set; } = new List<Product>();
}
