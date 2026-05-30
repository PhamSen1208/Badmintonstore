using BadmintonStores.Domain.Entities;
using BadmintonStores.Domain.Enums;
using BadmintonStores.Application.Common.Exceptions;
using BadmintonStores.Application.DTOs.Products;
using Microsoft.EntityFrameworkCore;
using BadmintonStores.Infrastructure.Data;
using BadmintonStores.Application.Interfaces;

namespace BadmintonStores.Infrastructure.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _dbContext;

    public ProductService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CreateProductResult> CreateProductAsync(CreateProductDto request, CancellationToken cancellationToken = default)
    {
        ValidateRequest(request);

        var productCodeExist = await _dbContext.Products.AnyAsync(p => p.ProductCode == request.ProductCode, cancellationToken);
        if(productCodeExist)
        {
            throw new ValidationException("PRODUCT_CODE_EXISTS", "Mã sản phẩm đã tồn tại");        
        }

        var product = new Product
        {
            ProductCode = request.ProductCode.Trim(),
            ProductName = request.ProductName.Trim(),
            BasePrice = request.BasePrice,
            Description = request.Description,
            Warranty = request.Warranty,
            Status = RecordStatus.Active,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Products.Add(product);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new CreateProductResult
        {
            ProductId = product.Id,
            ProductCode = product.ProductCode,
            ProductName = product.ProductName,
            BasePrice = product.BasePrice,
            Status = product.Status.ToString().ToLowerInvariant(),
            CreatedAt = product.CreatedAt
        };
    }

    public async Task<GetProductDetailResult>  GetProductByIdAsync(int productId, CancellationToken cancellationToken = default)
    {
        if(productId <= 0)
        {
            throw new NotFoundException("PRODUCT_NOT_FOUND", "Mã sản phẩm không hợp lệ");
        }

        var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == productId, cancellationToken);
        if(product == null)
        {
            throw new NotFoundException("PRODUCT_NOT_FOUND", "Không tìm thấy sản phẩm");
        }

        return new GetProductDetailResult
        {
            ProductId = product.Id,
            ProductCode = product.ProductCode,
            ProductName = product.ProductName,
            BasePrice = product.BasePrice,
            Description = product.Description,
            Warranty = product.Warranty,
            Status = product.Status.ToString().ToLowerInvariant(),
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };
    }

    public async Task<UpdateProductStatusResult> UpdateProductStatusAsync(UpdateProductStatusDto request, CancellationToken cancellationToken)
    {
        if(request.ProductId <= 0)
        {
            throw new ValidationException("INVALID_PRODUCT_ID", "Mã sản phẩm không hợp lệ");
        }
        
        var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == request.ProductId);
        if(product == null)
        {
            throw new ValidationException("PRODUCT_NOT_FOUND", "Sản phẩm không tồn tại");
        }

        product.Status = ParseRecordStatus(request.Status);
        product.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new UpdateProductStatusResult
        {
            ProductId = product.Id,
            ProductCode = product.ProductCode,
            Status = product.Status.ToString().ToLowerInvariant(),
            UpdatedAt = product.UpdatedAt
        };
    }

    public async Task<UpdateProductResult> UpdateProductAsync(UpdateProductDto request, CancellationToken cancellationToken)
    {
        if(request.ProductId <= 0)
        {
            throw new ValidationException("INVALID_PRODUCT_ID", "Mã sản phẩm không hợp lệ");
        }
        if(string.IsNullOrWhiteSpace(request.ProductName))
        {
            throw new ValidationException("PRODUCT_NAME_REQUIRE", "Tên sản phẩm là bắt buộc");
        }

        if(request.ProductName.Length > 255)
        {
            throw new ValidationException("PRODUCT_NAME_TOO_LONG", "Tên sản phẩm quá dài");
        }

        if(request.BasePrice <=0)
        {
            throw new ValidationException("INVALID_BASE_PRICE", "Giá tiền phải lớn hơn 0");
        }

        var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == request.ProductId);
        if(product == null)
        {
            throw new ValidationException("PRODUCT_NOT_FOUND", "Sản phẩm không tồn tại");
        }

        product.ProductName = request.ProductName.Trim();
        product.BasePrice = request.BasePrice;
        product.Description = request.Description;
        product.Warranty = request.Warranty;
        product.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return new UpdateProductResult
        {
            ProductId = product.Id,
            ProductCode = product.ProductCode,
            ProductName = product.ProductName,
            BasePrice = product.BasePrice,
            Description = product.Description,
            Warranty = product.Warranty,
            Status = product.Status.ToString().ToLowerInvariant(),
            UpdatedAt = product.UpdatedAt
        };
    }

    public async Task<GetProductsResult> GetProductsAsync(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var pageNumber = request.PageNumber <= 0 ? 1 : request.PageNumber;
        var pageSize = request.PageSize <= 0 ? 20 : request.PageSize;

        pageSize = pageSize > 100 ? 100 : pageSize; // Giới hạn

        var productsQuery = _dbContext.Products.AsQueryable();

        //filter theo keyword
        if(!string.IsNullOrWhiteSpace(request.Keyword))
        {
            var keyword = request.Keyword.Trim();
            productsQuery = productsQuery.Where(
                p => p.ProductCode.Contains(keyword) ||
                p.ProductName.Contains(request.Keyword));
        }

        //filter theo trạng thái
        if(!string.IsNullOrWhiteSpace(request.Status))
        {
            var status = ParseRecordStatus(request.Status);
            productsQuery = productsQuery.Where(p => p.Status == status);
        }

        var totalItems = await productsQuery.CountAsync(cancellationToken);
        var totalPages = (int)Math.Ceiling(totalItems/(double)pageSize);

        var items = await productsQuery
            .OrderByDescending(p => p.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new GetProductsItemResult
            {
                ProductId = p.Id,
                ProductCode = p.ProductCode,
                ProductName = p.ProductName,
                BasePrice = p.BasePrice,
                Status = p.Status.ToString().ToLowerInvariant(),
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            }).ToListAsync(cancellationToken);
        
        return new GetProductsResult
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalPages
        };
    } 

    private static void ValidateRequest(CreateProductDto request)
    {
        if(string.IsNullOrWhiteSpace(request.ProductCode))
        {
            throw new ValidationException("PRODUCT_CODE_REQUIRE","Mã sản phẩm là bắt buộc");
        }

        if(string.IsNullOrWhiteSpace(request.ProductName))
        {
            throw new ValidationException("PRODUCT_NAME_REQUIRE", "Tên sản phẩm là bắt buộc");
        }

        if(request.BasePrice <= 0)
        {
            throw new ValidationException("INVALID_BASE_PRICE", "Giá gốc không được nhỏ hơn 0");
        }

        if (request.ProductCode.Length > 50)
        {
            throw new ValidationException("PRODUCT_CODE_TOO_LONG", "Mã sản phẩm quá dài");
        }

        if (request.ProductName.Length > 255)
        {
            throw new ValidationException("PRODUCT_NAME_TOO_LONG", "Tên sản phẩm quá dài");
        }
        if(request.Description?.Length > 1000)
        {
            throw new ValidationException("DESCRIPTION_TOO_LONG","Mô tả quá dài");
        }
    }

    private static RecordStatus ParseRecordStatus(string status)
    {
        return status.Trim().ToLowerInvariant() switch
        {
            "active" => RecordStatus.Active,
            "inactive" => RecordStatus.Inactive,
            _ => throw new ValidationException("INVALID_PRODUCT_STATUS", "Trạng thái của sản phẩm chưa được hỗ trợ")
        };
    }
}