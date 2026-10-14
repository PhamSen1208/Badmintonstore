using System.Collections.Concurrent;
using System.Threading.Tasks.Dataflow;
using BadmintonStores.Application.DTOs.ProductReviews;

namespace BadmintonStores.Application.Interfaces;

public interface IProductReviewService
{
    Task<IEnumerable<ProductReviewDto>> GetProductReviewsAsync(int productId, int? ratingFilter = null);
    Task<ProductReviewSummaryDto> GetProductRatingSummaryAsync(int productId);
    Task<ProductReviewDto> CreateReviewAsync(int userId, CreateProductReviewDto dto);
    Task<bool> DeleteReviewAsync(int userId, int reviewId);
    Task<bool> AdminDeleteReviewAsync(int reviewId);
    Task<GetAdminReviewsResult> GetAdminReviewsAsync(GetAdminReviewsQuery query);
}
