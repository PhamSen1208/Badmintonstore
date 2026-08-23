namespace BadmintonStores.Api.Requests.Categories;

public class CreateCategoryRequest
{
    public string CategoryCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? Description { get; set; }
    public int? ParentId { get; set; }
}
