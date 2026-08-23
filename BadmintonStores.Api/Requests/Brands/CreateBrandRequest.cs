namespace BadmintonStores.Api.Requests.Brands;

public class CreateBrandRequest
{
    public string BrandCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? LogoUrl { get; set; }
    public string? Description { get; set; }
}
