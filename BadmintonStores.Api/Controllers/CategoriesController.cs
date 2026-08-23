using BadmintonStores.Api.Requests.Categories;
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
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public CategoriesController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategories(CancellationToken cancellationToken)
    {
        var categories = await _dbContext.Categories
            .OrderBy(c => c.Name)
            .Select(c => new
            {
                c.Id,
                c.CategoryCode,
                c.Name,
                c.Slug,
                c.Description,
                c.ParentId,
                c.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return Ok(ApiResponse<object>.Ok(categories, "Lấy danh sách danh mục thành công"));
    }

    [Authorize(Roles = RoleNames.AdminOrStaff)]
    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.CategoryCode))
        {
            throw new ValidationException("INVALID_CATEGORY_CODE", "Mã danh mục không được để trống");
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new ValidationException("INVALID_NAME", "Tên danh mục không được để trống");
        }

        var categoryCode = request.CategoryCode.Trim().ToUpper();
        var codeExists = await _dbContext.Categories.AnyAsync(c => c.CategoryCode == categoryCode, cancellationToken);
        if (codeExists)
        {
            throw new ValidationException("CATEGORY_CODE_EXISTS", "Mã danh mục đã tồn tại");
        }

        var slug = string.IsNullOrWhiteSpace(request.Slug)
            ? request.Name.ToLower().Replace(" ", "-")
            : request.Slug.ToLower();

        var slugExists = await _dbContext.Categories.AnyAsync(c => c.Slug == slug, cancellationToken);
        if (slugExists)
        {
            throw new ValidationException("SLUG_EXISTS", "Slug danh mục đã tồn tại");
        }

        var category = new Category
        {
            CategoryCode = categoryCode,
            Name = request.Name.Trim(),
            Slug = slug,
            Description = request.Description?.Trim(),
            ParentId = request.ParentId,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Categories.Add(category);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(ApiResponse<object>.Ok(category, "Tạo danh mục thành công"));
    }
}
