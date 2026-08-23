using BadmintonStores.Api.Requests.Products;
using BadmintonStores.Api.Responses;
using BadmintonStores.Application.Common.Exceptions;
using BadmintonStores.Application.Common.Security;
using BadmintonStores.Domain.Entities;
using BadmintonStores.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BadmintonStores.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductImagesController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public ProductImagesController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("product/{productId:int}")]
    public async Task<IActionResult> GetProductImages(int productId, CancellationToken cancellationToken)
    {
        var images = await _dbContext.ProductImages
            .Where(pi => pi.ProductId == productId)
            .OrderByDescending(pi => pi.IsPrimary)
            .ThenBy(pi => pi.DisplayOrder)
            .ToListAsync(cancellationToken);

        return Ok(ApiResponse<object>.Ok(images, "Lấy danh sách ảnh sản phẩm thành công"));
    }

    [Authorize(Roles = RoleNames.AdminOrStaff)]
    [HttpPost]
    public async Task<IActionResult> AddProductImage([FromBody] AddProductImageRequest request, CancellationToken cancellationToken)
    {
        var productExists = await _dbContext.Products.AnyAsync(p => p.Id == request.ProductId, cancellationToken);
        if (!productExists)
        {
            throw new NotFoundException("PRODUCT_NOT_FOUND", "Sản phẩm không tồn tại");
        }

        if (request.IsPrimary)
        {
            var existingPrimary = await _dbContext.ProductImages
                .Where(pi => pi.ProductId == request.ProductId && pi.IsPrimary)
                .ToListAsync(cancellationToken);
            foreach (var img in existingPrimary)
            {
                img.IsPrimary = false;
            }
        }

        var image = new ProductImage
        {
            ProductId = request.ProductId,
            ProductVariantId = request.ProductVariantId,
            ImageUrl = request.ImageUrl.Trim(),
            IsPrimary = request.IsPrimary,
            DisplayOrder = request.DisplayOrder,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.ProductImages.Add(image);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(ApiResponse<object>.Ok(image, "Thêm ảnh sản phẩm thành công"));
    }
}
