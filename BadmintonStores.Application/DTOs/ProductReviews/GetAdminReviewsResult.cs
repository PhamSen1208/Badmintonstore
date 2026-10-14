namespace BadmintonStores.Application.DTOs.ProductReviews;

public class GetAdminReviewsResult
{
    public IEnumerable<ProductReviewDto> Items { get; set; } = new List<ProductReviewDto>();
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
}
