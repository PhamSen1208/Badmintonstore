using BadmintonStores.Application.Common.Exceptions;
using BadmintonStores.Application.DTOs.WishList;
using BadmintonStores.Application.Interfaces;
using BadmintonStores.Domain.Entities;
using BadmintonStores.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BadmintonStores.Infrastructure.Services;

public class WishlistService : IWishListService
{
    private readonly AppDbContext _dbContext;
    public WishlistService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<WishListItemDto>> GetMyWishlistAsync(int customerId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.WishLists 
            .AsNoTracking()
            .Where(w => w.CustomerId == customerId)
            .OrderByDescending(w => w.CreatedAt)
           .Select(w => new WishListItemDto {
                ProductId = w.ProductId,
                ProductName = w.Product.ProductName,  
                BrandName = w.Product.Brand != null ? w.Product.Brand.Name : null,
                CategoryName = w.Product.Category != null ? w.Product.Category.Name : null,
                BasePrice = w.Product.BasePrice,
                PrimaryImageUrl = w.Product.Images
                    .Where(img => img.IsPrimary)
                    .Select(img => img.ImageUrl)
                    .FirstOrDefault() ?? w.Product.Images.Select(img => img.ImageUrl).FirstOrDefault(), // <-- THÊM LẤY ẢNH
                AddedAt = w.CreatedAt
})

            .ToListAsync(cancellationToken);
    }

    public async Task<List<int>> GetMyWishlistProductIdsAsync(int customerId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.WishLists 
            .AsNoTracking()
            .Where(w => w.CustomerId == customerId)
            .Select(w => w.ProductId)
            .ToListAsync(cancellationToken);
    }

    //Thay đổi thích => k thích
    public async Task<ToggleWishListResult> ToggleWishlistAsync(int customerId, int productId, CancellationToken cancellationToken = default)
    {
        var productExist = await _dbContext.Products.AnyAsync(p => p.Id == productId, cancellationToken);
        if(!productExist)
        {
            throw new NotFoundException("PRODUCT_NOT_FOUND", "Không có sản phẩm nào");
        }

        var existingWishListItem = await _dbContext.WishLists
            .FirstOrDefaultAsync(w => w.CustomerId == customerId && w.ProductId == productId, cancellationToken);

        if (existingWishListItem != null)
        {

            //Thích => bỏ
            _dbContext.WishLists.Remove(existingWishListItem);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return new ToggleWishListResult
            {
                productId = productId,
                IsFavorite = false,
                Message = "Đã bỏ sản phẩm khỏi danh sách yêu thích"
            };
        }
        //chua thích => thêm vào yêu Thích
        var newWishListItem = new WishList
        {
            CustomerId = customerId,
            ProductId = productId,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.WishLists.Add(newWishListItem);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return new ToggleWishListResult
        {
            productId = productId,
            IsFavorite = true,
            Message = "Đã thêm sản phẩm vào danh sách yêu thích"
        };
    }
}
