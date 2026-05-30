using BadmintonStores.Application.Common.Exceptions;
using BadmintonStores.Application.DTOs.ProductVariants;
using BadmintonStores.Application.Interfaces;
using BadmintonStores.Domain.Entities;
using BadmintonStores.Domain.Enums;
using BadmintonStores.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BadmintonStores.Infrastructure.Services;

public class ProductVariantService : IProductVariantService
{
    private readonly AppDbContext _dbContext;
    
    public ProductVariantService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    } 
    
    public async Task<CreateProductVariantResult> CreateProductVariantAsync (CreateProductVariantDto request, CancellationToken cancellationToken = default)
    {
        ValidateRequest(request);
        var productExists = await _dbContext.Products.AnyAsync(p => p.Id == request.ProductId, cancellationToken);
        if(!productExists)
        {
            throw new NotFoundException("PRODUCT_NOT_FOUND", "Không tìm thấy sản phẩm");
        }
        var sku = request.SKU.Trim();

        var skuExists = await _dbContext.ProductVariants.AnyAsync(pv => pv.SKU == sku, cancellationToken);
        if (skuExists)
        {
            throw new ValidationException("SKU_ALREADY_EXISTS", "Mã SKU đã tồn tại");
        }

        var variant = new ProductVariant
        {
            ProductId = request.ProductId,
            SKU = request.SKU,
            Price = request.Price,
            SalePrice = request.SalePrice,
            Color = request.Color,
            Size = request.Size,
            Weight = request.Weight,
            Status = RecordStatus.Active,
            CreatedAt = DateTime.UtcNow
        };
        _dbContext.ProductVariants.Add(variant);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new CreateProductVariantResult
        {
            ProductVariantId = variant.Id,
            ProductId = variant.ProductId,
            SKU = variant.SKU,
            Price = variant.Price,
            SalePrice = variant.SalePrice,
            Weight = variant.Weight,
            Size = variant.Size,
            Color = variant.Color,
            Status = variant.Status.ToString().ToLowerInvariant(),
            CreatedAt = variant.CreatedAt
        };
    }

    public async Task<GetProductVariantDetailResult> GetProductVariantByIdAsync(int productVariantId, CancellationToken cancellationToken)
    {
        if(productVariantId <= 0)
        {
            throw new NotFoundException("NOT_FOUND_PRODUCT_VARIANT", "Mã thuộc tính không hợp lệ");
        }

        var variant = await _dbContext.ProductVariants  
            .Include(v => v.Product)
            .FirstOrDefaultAsync(v => v.Id == productVariantId, cancellationToken);
        
        if(variant == null)
        {
            throw new NotFoundException("NOT_FOUND_PRODUCT_VARIANT", "Thuộc tính không tồn tại");
        }

        return new GetProductVariantDetailResult
        {
            ProductVariantId = variant.Id,
            ProductId = variant.ProductId,
            ProductCode = variant.Product.ProductCode,
            ProductName = variant.Product.ProductName,
            SKU = variant.SKU,
            Price = variant.Price,
            SalePrice = variant.SalePrice,
            Weight = variant.Weight,
            Color = variant.Color,
            Size = variant.Size,
            Status = variant.Status.ToString().ToLowerInvariant(),
            CreatedAt = variant.CreatedAt,
            UpdatedAt = variant.UpdatedAt  
        };
    }

    public async Task<GetProductVariantsResult> GetProductVariantsAsync(GetProductVariantsQuery request, CancellationToken cancellationToken)
    {
        if(request.ProductId <= 0)
        {
            throw new NotFoundException("PRODUCT_ID_NOT_FOUND", "Không tìm thấy sản phẩm");
        }

        //Tìm product cha, lấy thông tin cần của product để trả về response
        var product = await _dbContext.Products
            .Where(p => p.Id == request.ProductId)
            .Select(p => new
            {
                p.Id,
                p.ProductCode,
                p.ProductName
            }).FirstOrDefaultAsync(cancellationToken);

        if(product == null)
        {
            throw new NotFoundException("PRODUCT_NOT_FOUND", "Không tìm thấy sản phẩm");
        }

        var pageNumber = request.PageNumber <= 0 ? 1 : request.PageNumber;
        var pageSize = request.PageSize <= 0 ? 20 : request.PageSize;

        if(pageSize >100)
        {
            pageSize = 100;
        }
        //Lấy danh sách thuộc tính của product đó
        var query = _dbContext.ProductVariants.Where(v => v.ProductId == request.ProductId);

        if(!string.IsNullOrWhiteSpace(request.Keyword))
        {
            var keyword = request.Keyword.Trim();

            query = query.Where(
                v => v.SKU.Contains(keyword) ||
                (v.Color != null && v.Color.Contains(keyword)) ||
                (v.Size != null && v.Size.Contains(keyword)));
        }

        if (!string.IsNullOrWhiteSpace(request.Status))
{
            var status = ParseRecordStatus(request.Status);
            query = query.Where(v => v.Status == status);
        }

        var totalItems = await query.CountAsync(cancellationToken);
        var totalPages = (int)Math.Ceiling(totalItems/(double)pageSize);

        var items = await query
            .OrderByDescending(v => v.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(v => new GetProductVariantsItemResult
            {
                ProductVariantId = v.Id,
                SKU = v.SKU,
                Price = v.Price,
                SalePrice = v.SalePrice,
                Weight = v.Weight,
                Color = v.Color,
                Size = v.Size,
                Status = v.Status.ToString().ToLowerInvariant(),
                CreatedAt = v.CreatedAt,
                UpdatedAt = v.UpdatedAt
            }).ToListAsync(cancellationToken);
        
        return new GetProductVariantsResult
        {
            ProductId = product.Id,
            ProductCode = product.ProductCode,
            ProductName = product.ProductName,
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalPages
        };
    }

    public async Task<UpdateProductVariantResult> UpdateProductVariantAsync(UpdateProductVariantDto request, CancellationToken cancellationToken)
    {
        ValidateUpdateRequest(request);
        var variant = await _dbContext.ProductVariants   
            .Include(v => v.Product)
            .FirstOrDefaultAsync(v => v.Id == request.ProductVariantId, cancellationToken);
        
        if(variant == null)
        {
            throw new NotFoundException("PRODUCT_VARIANT_NOT_FOUND", "Không tìm thấy mã thuộc tính");
        }
        variant.Price = request.Price;
        variant.SalePrice = request.SalePrice;
        variant.Color = request.Color;
        variant.Weight = request.Weight;
        variant.Size = request.Size;
        variant.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        
        return new UpdateProductVariantResult
        {
            ProductVariantId = variant.Id,
            ProductId = variant.ProductId,
            ProductCode = variant.Product.ProductCode,
            ProductName = variant.Product.ProductName,
            SKU = variant.SKU,
            Price = variant.Price,
            SalePrice = variant.SalePrice,
            Color = variant.Color,
            Size = variant.Size,
            Weight = variant.Weight,
            Status = variant.Status.ToString().ToLowerInvariant(),
            CreatedAt = variant.CreatedAt,
            UpdatedAt = variant.UpdatedAt
        };
    }

    public async Task<UpdateProductVariantStatusResult> UpdateProductVariantStatusAsync(UpdateProductVariantStatusDto request, CancellationToken cancellationToken)
    {
        if(request.ProductVariantId <= 0)
        {
            throw new ValidationException("INVALID_PRODUCT_VARIANT_ID", "Mã thuộc tính không hợp lệ");
        }

        var variant = await _dbContext.ProductVariants.FirstOrDefaultAsync(v => v.Id == request.ProductVariantId, cancellationToken);
        if(variant == null)
        {
            throw new NotFoundException("PRODUCT_VARIANT_ID_NOT_FOUND", "Không tìm thấy mã thuộc tính sản phẩm");
        }
        variant.Status = ParseRecordStatus(request.Status);
        variant.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new UpdateProductVariantStatusResult
        {
            ProductVariantId = variant.Id,
            Status = variant.Status.ToString().ToLowerInvariant(),
            UpdatedAt = variant.UpdatedAt 
        };
    }

    private static void ValidateRequest(CreateProductVariantDto request)
    {
        if(request.ProductId <= 0)
        {
            throw new ValidationException("INVALID_PRODUCT_ID", "Mã sản phẩm là bắt buộc");
        }
        if(request.Price <= 0)
        {
            throw new ValidationException("INVALID_PRICE", "Giá bán phải lớn hơn 0");
        }
        if(string.IsNullOrWhiteSpace(request.SKU))
        {
            throw new ValidationException("SKU_REQUIRE", "Mã SKU là bắt buộc");
        }
        if(request.SalePrice.HasValue && request.SalePrice <= 0)
        {
            throw new ValidationException("INVALID_SALE_PRICE", "Giá bán phải lớn hơn 0");
        }
        if (request.SalePrice.HasValue && request.SalePrice.Value > request.Price)
        {
            throw new ValidationException("INVALID_SALE_PRICE", "Sale price không được lớn hơn price.");
        }
        if(request.Weight.HasValue && request.Weight <= 0)
        {
            throw new ValidationException("INVALID_WEIGTH", "Cân nặng phải lớn hơn 0");
        }
    }

    private static void ValidateUpdateRequest(UpdateProductVariantDto request)
    {
        if (request.ProductVariantId <= 0)
        {
            throw new ValidationException("INVALID_PRODUCT_VARIANT_ID", "ProductVariantId không hợp lệ");
        }
        if (request.Price <= 0)
        {
            throw new ValidationException("INVALID_PRICE", "Giá tiền phải lớn hơn 0.");
        }
        if (request.SalePrice.HasValue && request.SalePrice.Value <= 0)
        {
            throw new ValidationException("INVALID_SALE_PRICE", "Giá bán phải lớn hơn 0.");
        }
        if (request.SalePrice.HasValue && request.SalePrice.Value > request.Price)
        {
            throw new ValidationException("INVALID_SALE_PRICE", "Sale price không được lớn hơn price.");
        }

        if (request.Weight.HasValue && request.Weight.Value <= 0)
        {
            throw new ValidationException("INVALID_WEIGHT", "Weight must be greater than 0.");
        }
    }

    private static RecordStatus ParseRecordStatus(string status)
    {
        return status.Trim().ToLowerInvariant() switch
        {
            "active" => RecordStatus.Active,
            "inactive" => RecordStatus.Inactive,
            _ => throw new ValidationException("INVALID_PRODUCT_VARIANT_STATUS", "Trạng thái của thuộc tính sản phẩm chưa được hỗ trợ")
        };
    }
}