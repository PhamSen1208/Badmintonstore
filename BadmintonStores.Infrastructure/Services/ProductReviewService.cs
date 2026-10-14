using BadmintonStores.Application.Common.Exceptions;
using BadmintonStores.Application.DTOs.ProductReviews;
using BadmintonStores.Application.Interfaces;
using BadmintonStores.Domain.Entities;
using BadmintonStores.Domain.Enums;
using BadmintonStores.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace BadmintonStores.Infrastructure.Services;

public class ProductReviewService : IProductReviewService
{
    private readonly AppDbContext _dbContext;

    public ProductReviewService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<ProductReviewDto>> GetProductReviewsAsync(int productId, int? ratingFilter = null)
    {
        var query = _dbContext.ProductReviews
            .AsNoTracking()
            .Include(r => r.Customer)
            .ThenInclude(c => c.User)
            .Where(r => r.ProductId == productId);

        if (ratingFilter.HasValue && ratingFilter.Value >= 1 && ratingFilter.Value <= 5)
        {
            query = query.Where(r => r.Rating == ratingFilter.Value);
        }

        var reviews = await query
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return reviews.Select(r => new ProductReviewDto
        {
            Id = r.Id,
            CustomerId = r.CustomerId,
            CustomerName = r.Customer != null ? $"{r.Customer.FullName}".Trim() : "Khách hàng", 
            ProductId = r.ProductId,
            OrderId = r.OrderId,
            Rating = r.Rating,
            Comment = r.Comment,
            IsVerifiedPurchase = r.IsVerifiedPurchase,
            CreatedAt = r.CreatedAt
        });
    }

    public async Task<ProductReviewSummaryDto> GetProductRatingSummaryAsync(int productId)
    {
        var reviews = await _dbContext.ProductReviews
            .AsNoTracking()
            .Where(r => r.ProductId == productId)
            .ToListAsync();

        if (!reviews.Any())
        {
            return new ProductReviewSummaryDto
            {
                ProductId = productId,
                AverageRating = 0,
                TotalReviews = 0,
                FiveStarCount = 0,
                FourStarCount = 0,
                ThreeStarCount = 0,
                TwoStarCount = 0,
                OneStarCount = 0
            };
        }

        int total = reviews.Count;
        double avg = Math.Round(reviews.Average(r => r.Rating), 1);

        return new ProductReviewSummaryDto
        {
            ProductId = productId,
            AverageRating = avg,
            TotalReviews = total,
            FiveStarCount = reviews.Count(r => r.Rating == 5),
            FourStarCount = reviews.Count(r => r.Rating == 4),
            ThreeStarCount = reviews.Count(r => r.Rating == 3),
            TwoStarCount = reviews.Count(r => r.Rating == 2),
            OneStarCount = reviews.Count(r => r.Rating == 1)
        };
    }

    public async Task<ProductReviewDto> CreateReviewAsync(int userId, CreateProductReviewDto dto)
    {
        var customer = await _dbContext.Customers
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if(customer == null)
        {
            throw new NotFoundException("CUSTOMER_NOT_FOUND", "Không tìm thấy thông tin khách hàng.");
        }

        var productExists = await _dbContext.Products.AnyAsync(p => p.Id == dto.ProductId);
        if (!productExists)
        {
            throw new NotFoundException("PRODUCT_NOT_FOUND", "Không tìm thấy sản phẩm.");
        }

        // Kiểm tra xem khách hàng có đơn hàng hoàn thành chứa sản phẩm này không
        bool isVerified = await _dbContext.Orders
            .AsNoTracking()
            .AnyAsync(o => o.CustomerId == customer.Id 
                        && (o.Status == OrderStatus.Completed || o.Status == OrderStatus.Confirmed)  
                        && o.OrderDetails.Any(d => d.ProductId == dto.ProductId));

        // Kiểm tra xem đã đánh giá sản phẩm này trước đó chưa
        var existingReview = await _dbContext.ProductReviews
            .FirstOrDefaultAsync(r => r.CustomerId == customer.Id && r.ProductId == dto.ProductId && (dto.OrderId == null || r.OrderId == dto.OrderId));

        ProductReview review;
        if (existingReview != null)
        {
            // Cập nhật đánh giá cũ
            existingReview.Rating = dto.Rating;
            existingReview.Comment = dto.Comment;
            existingReview.IsVerifiedPurchase = isVerified;
            existingReview.UpdatedAt = DateTime.UtcNow;
            review = existingReview;
        }
        else
        {
            review = new ProductReview
            {
                CustomerId = customer.Id,
                ProductId = dto.ProductId,
                OrderId = dto.OrderId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                IsVerifiedPurchase = isVerified,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _dbContext.ProductReviews.Add(review);
        }

        await _dbContext.SaveChangesAsync();

        return new ProductReviewDto
        {
            Id = review.Id,
            CustomerId = review.CustomerId,
            CustomerName = $"{customer.FullName}",
            ProductId = review.ProductId,
            OrderId = review.OrderId,
            Rating = review.Rating,
            Comment = review.Comment,
            IsVerifiedPurchase = review.IsVerifiedPurchase,
            CreatedAt = review.CreatedAt
        };
    }

    public async Task<bool> DeleteReviewAsync(int userId, int reviewId)
    {
        var customer = await _dbContext.Customers.FirstOrDefaultAsync(c => c.UserId == userId);
        if (customer == null) return false;

        var review = await _dbContext.ProductReviews.FirstOrDefaultAsync(r => r.Id == reviewId && r.CustomerId == customer.Id);
        if (review == null) return false;

        _dbContext.ProductReviews.Remove(review);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> AdminDeleteReviewAsync(int reviewId) 
    {
        var review = await _dbContext.ProductReviews.FirstOrDefaultAsync(r => r.Id == reviewId);
        if (review == null) return false;

        _dbContext.ProductReviews.Remove(review);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<GetAdminReviewsResult> GetAdminReviewsAsync(GetAdminReviewsQuery query)
    {
        var page = query.PageNumber <= 0 ? 1 : query.PageNumber;
        var pageSize = query.PageSize <= 0 ? 10 : query.PageSize;
        
        var reviewsQuery = _dbContext.ProductReviews
            .AsNoTracking()
            .Include(r => r.Customer)
            .Include(r => r.Product)
            .Include(r => r.Customer.User)
            .AsQueryable();

            if(!string.IsNullOrWhiteSpace(query.Keyword))
            {
                var keyword = query.Keyword.Trim().ToLower();
                //Tìm kiếm đánh giá theo bình luận, tên sản phẩm, tên khách hàng
                reviewsQuery = reviewsQuery.Where(r => 
                    r.Comment.ToLower().Contains(keyword) ||
                    (r.Product != null && r.Product.ProductName.ToLower().Contains(keyword)) ||
                    (r.Customer != null && r.Customer.FullName.ToLower().Contains(keyword))
                );
            }

            if(query.Rating.HasValue && query.Rating.Value >= 1 && query.Rating.Value <= 5)
            {
                reviewsQuery = reviewsQuery.Where(r => r.Rating == query.Rating.Value);
            }

            var totalItems = await reviewsQuery.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems/(double)pageSize);
            
            page = Math.Max(1, Math.Min(page, totalPages));
            
            //danh sách đánh giá
            var items = await reviewsQuery
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select( r => new ProductReviewDto {
                    Id = r.Id,
                    CustomerId = r.CustomerId,
                    CustomerName = r.Customer != null ? r.Customer.FullName : "Khách hàng",
                    ProductId = r.ProductId,
                    ProductName = r.Product != null ? r.Product.ProductName : string.Empty,
                    OrderId = r.OrderId,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    IsVerifiedPurchase = r.IsVerifiedPurchase,
                    CreatedAt = r.CreatedAt 
                }).ToListAsync();

            return new GetAdminReviewsResult
            {
                Items = items,
                PageNumber = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = totalPages
            };       
    }
}
