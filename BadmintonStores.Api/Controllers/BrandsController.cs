using BadmintonStores.Api.Requests.Brands;
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
public class BrandsController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public BrandsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetBrands(CancellationToken cancellationToken)
    {
        var brands = await _dbContext.Brands
            .OrderBy(b => b.Name)
            .Select(b => new
            {
                b.Id,
                b.BrandCode,
                b.Name,
                b.Slug,
                b.LogoUrl,
                b.Description,
                b.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return Ok(ApiResponse<object>.Ok(brands, "Lấy danh sách thương hiệu thành công"));
    }

    [Authorize(Roles = RoleNames.AdminOrStaff)]
    [HttpPost]
    public async Task<IActionResult> CreateBrand([FromBody] CreateBrandRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.BrandCode))
        {
            throw new ValidationException("INVALID_BRAND_CODE", "Mã thương hiệu không được để trống");
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new ValidationException("INVALID_NAME", "Tên thương hiệu không được để trống");
        }

        var brandCode = request.BrandCode.Trim().ToUpper();
        var codeExists = await _dbContext.Brands.AnyAsync(b => b.BrandCode == brandCode, cancellationToken);
        if (codeExists)
        {
            throw new ValidationException("BRAND_CODE_EXISTS", "Mã thương hiệu đã tồn tại");
        }

        var slug = string.IsNullOrWhiteSpace(request.Slug)
            ? request.Name.ToLower().Replace(" ", "-")
            : request.Slug.ToLower();

        var slugExists = await _dbContext.Brands.AnyAsync(b => b.Slug == slug, cancellationToken);
        if (slugExists)
        {
            throw new ValidationException("SLUG_EXISTS", "Slug thương hiệu đã tồn tại");
        }

        var brand = new Brand
        {
            BrandCode = brandCode,
            Name = request.Name.Trim(),
            Slug = slug,
            LogoUrl = request.LogoUrl?.Trim(),
            Description = request.Description?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Brands.Add(brand);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(ApiResponse<object>.Ok(brand, "Tạo thương hiệu thành công"));
    }
}
