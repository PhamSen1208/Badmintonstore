using System.Security.Claims;
using BadmintonStores.Api.Requests.ProductReviews;
using BadmintonStores.Api.Responses;
using BadmintonStores.Api.Responses.ProductReviews;
using BadmintonStores.Application.DTOs.ProductReviews;
using BadmintonStores.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BadmintonStores.Api.Controllers;

[ApiController]
[Route("api/reviews")]
public class ProductReviewsController : ControllerBase
{
    private readonly IProductReviewService _reviewService;

    public ProductReviewsController(IProductReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet("product/{productId:int}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductReviewResponse>>>> GetProductReviews(int productId, [FromQuery] int? rating)
    {
        var reviews = await _reviewService.GetProductReviewsAsync(productId, rating);
        var response = reviews.Select(r => new ProductReviewResponse
        {
            Id = r.Id,
            CustomerId = r.CustomerId,
            CustomerName = r.CustomerName,
            CustomerAvatar = r.CustomerAvatar,
            ProductId = r.ProductId,
            OrderId = r.OrderId,
            Rating = r.Rating,
            Comment = r.Comment,
            IsVerifiedPurchase = r.IsVerifiedPurchase,
            CreatedAt = r.CreatedAt
        });
        return Ok(ApiResponse<IEnumerable<ProductReviewResponse>>.Ok(response, "Lấy danh sách đánh giá thành công"));
    }

    [HttpGet("product/{productId:int}/summary")]
    public async Task<ActionResult<ApiResponse<ProductReviewSummaryResponse>>> GetProductRatingSummary(int productId)
    {
        var summary = await _reviewService.GetProductRatingSummaryAsync(productId);
        var response = new ProductReviewSummaryResponse
        {
            ProductId = summary.ProductId,
            AverageRating = summary.AverageRating,
            TotalReviews = summary.TotalReviews,
            FiveStarCount = summary.FiveStarCount,
            FourStarCount = summary.FourStarCount,
            ThreeStarCount = summary.ThreeStarCount,
            TwoStarCount = summary.TwoStarCount,
            OneStarCount = summary.OneStarCount
        };
        return Ok(ApiResponse<ProductReviewSummaryResponse>.Ok(response, "Lấy tổng quan đánh giá thành công"));
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ApiResponse<ProductReviewResponse>>> CreateReview([FromBody] CreateProductReviewRequest request)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier); // Kiểm tra người dùng đã đăng nhập hay chưa  
        if (!int.TryParse(userIdStr, out var userId))
        {
            return Unauthorized();
        }

        var dto = new CreateProductReviewDto
        {
            ProductId = request.ProductId,
            OrderId = request.OrderId,
            Rating = request.Rating,
            Comment = request.Comment
        };

        var review = await _reviewService.CreateReviewAsync(userId, dto);
        var response = new ProductReviewResponse
        {
            Id = review.Id,
            CustomerId = review.CustomerId,
            CustomerName = review.CustomerName,
            CustomerAvatar = review.CustomerAvatar,
            ProductId = review.ProductId,
            OrderId = review.OrderId,
            Rating = review.Rating,
            Comment = review.Comment,
            IsVerifiedPurchase = review.IsVerifiedPurchase,
            CreatedAt = review.CreatedAt
        };

        return Ok(ApiResponse<ProductReviewResponse>.Ok(response, "Đánh giá sản phẩm thành công"));
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteReview(int id)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdStr, out var userId))
        {
            return Unauthorized();
        }

        var success = await _reviewService.DeleteReviewAsync(userId, id);
        if (!success)
        {
            return BadRequest(new { message = "Không thể xóa đánh giá này" });
        }

        return Ok(ApiResponse<bool>.Ok(true, "Xóa đánh giá thành công"));
    }

    [HttpDelete("admin/{id:int}")]
    [Authorize(Roles = "Admin,Staff")]
    public async Task<ActionResult<ApiResponse<bool>>> AdminDeleteReview(int id)
    {
        var success = await _reviewService.AdminDeleteReviewAsync(id);
        if (!success)
        {
            return BadRequest(new { message = "Không thể xóa đánh giá này" });
        }
        return Ok(ApiResponse<bool>.Ok(true, "Xóa đánh giá thành công"));
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin,Staff")]
    public async Task<ActionResult<ApiResponse<GetAdminReviewsResult>>> GetAdminReviews([FromQuery] GetAdminReviewsQuery request)
    {
        var query = new GetAdminReviewsQuery
        {
            Keyword = request.Keyword,
            Rating = request.Rating,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };

        var result = await _reviewService.GetAdminReviewsAsync(query);
        return Ok(ApiResponse<GetAdminReviewsResult>.Ok(result, "Lấy danh sách đánh giá cho admin thành công"));
    }

}
