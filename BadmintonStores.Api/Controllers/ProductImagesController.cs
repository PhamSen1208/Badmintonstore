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
    private readonly IWebHostEnvironment _env;

    public ProductImagesController(AppDbContext dbContext, IWebHostEnvironment env)
    {
        _dbContext = dbContext;
        _env = env;
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
            throw new ValidationException("PRODUCT_NOT_FOUND", "Sản phẩm không tồn tại");
        }

        var currentImageCount = await _dbContext.ProductImages.CountAsync(p => p.ProductId == request.ProductId, cancellationToken);
        if(currentImageCount > 8)
        {
            throw new ValidationException("MAX_IMAGE_LIMIT_EXCEEDED", "Sản phẩm đã đạt đến số lượng ảnh tối đa");
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

    [Authorize(Roles = RoleNames.AdminOrStaff)]
    [HttpPost("upload")]
    public async Task<IActionResult> UploadProductImage([FromForm] IFormFile file ,[FromForm] int productId, [FromForm] bool isPrimary, CancellationToken cancellationToken)
    {
        if (file == null || file.Length == 0 )
        {
            throw new ValidationException("FILE_REQUIRED", "Vui lòng chọn file ảnh để tải lên");
        }
        //GH dung lượng
        if(file.Length > 5 * 1024 * 1024)
        {
            throw new ValidationException("FILE_TOO_LARGE", "Dung lượng file không được vượt quá 5MB");
        }

        //GH sl ảnh
        var currentImageCount = await _dbContext.ProductImages.CountAsync(p => p.ProductId == productId, cancellationToken);
        if(currentImageCount >= 8)
        {
            throw new ValidationException("MAX_IMAGE_LIMIT_EXCEEDED", "Sản phẩm đã đạt đến số lượng ảnh tối đa");
        }
        //Ktra dinh dang ảnh
        var allowExtensions = new[] {".jpg", ".png", ".jpeg", ".webp"};
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowExtensions.Contains(extension))
        {
            throw new ValidationException("FILE_INVALID_TYPE", "Định dạng file không hợp lệ");
        }

        var productExists = await _dbContext.Products.AnyAsync(p => p.Id == productId, cancellationToken);
        if(!productExists)
        {
            throw new NotFoundException("PRODUCT_NOT_FOUND", "Không tìm thấy sản phẩm");
        }

        //Tạo thư mục vly lưu ảnh
        var uploadFolder = Path.Combine(_env.ContentRootPath, "wwwroot","uploads", "products");
        if(!Directory.Exists(uploadFolder))
        {
            Directory.CreateDirectory(uploadFolder);
        }

        //Đổi tên file random tránh trùng
        var uniqueFileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadFolder, uniqueFileName);

        //ghi file lên ổ cứng
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream, cancellationToken);
        }

        // Nếu ảnh này là ảnh chính (Primary), bỏ cờ các ảnh chính cũ
        if (isPrimary)
        {
            var oldPrimaries = await _dbContext.ProductImages
                .Where(pi => pi.ProductId == productId && pi.IsPrimary)
                .ToListAsync(cancellationToken);
            foreach (var img in oldPrimaries)
            {
                img.IsPrimary = false;
            }
        }

        // Lưu đường dẫn URL tương đối vào DB
        var relativeUrl = $"/uploads/products/{uniqueFileName}";
        var productImage = new ProductImage
        {
            ProductId = productId,
            ImageUrl = relativeUrl,
            IsPrimary = isPrimary,
            DisplayOrder = 1,
            CreatedAt = DateTime.UtcNow
        };
        _dbContext.ProductImages.Add(productImage);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return Ok(ApiResponse<ProductImage>.Ok(productImage, "Tải ảnh sản phẩm thành công"));
    }

    [Authorize(Roles =RoleNames.AdminOrStaff)]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProductImage(int id, CancellationToken cancellationToken)
    {
        //Ktra tồn tại ảnh
        var image = await _dbContext.ProductImages.FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
        if(image == null)
        {
            throw new NotFoundException("IMAGE_NOT_FOUND", "Không tìm thấy ảnh để xóa");
        }
        if(!string.IsNullOrEmpty(image.ImageUrl) && image.ImageUrl.StartsWith("/uploads/products/"))
        {
            var relativePath = image.ImageUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            var physicalPath = Path.Combine(_env.ContentRootPath, "wwwroot", relativePath);
            if (System.IO.File.Exists(physicalPath))
            {
                System.IO.File.Delete(physicalPath); // Dọn sạch file rác khỏi ổ đĩa
            }
        }

        //Nếu xóa ảnh đang là ảnh chính -> chuyển ảnh kế tiếp làm ảnh chính
        if(image.IsPrimary)
        {
            var nextImage = await _dbContext.ProductImages
                .Where(p => p.ProductId == image.ProductId && p.Id != id)
                .OrderBy(p => p.DisplayOrder)
                .FirstOrDefaultAsync(cancellationToken);
            if(nextImage != null)
            {
                nextImage.IsPrimary = true;
            }

        }
        _dbContext.ProductImages.Remove(image);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return Ok(ApiResponse<object>.Ok( null,"Xóa ảnh sản phẩm thành công"));
    } 
}
