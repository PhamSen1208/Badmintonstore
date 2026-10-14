using BadmintonStores.Domain.Entities;
using BadmintonStores.Domain.Enums;
using BadmintonStores.Application.Common.Exceptions;
using BadmintonStores.Application.DTOs.Coupons;
using Microsoft.EntityFrameworkCore;
using BadmintonStores.Infrastructure.Data;
using BadmintonStores.Application.Interfaces;

namespace BadmintonStores.Infrastructure.Services;

public class CouponService : ICouponService
{
    private readonly AppDbContext _dbContext;

    public CouponService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CouponValidateResultDto> ValidateAndCalculateCouponAsync(ValidateCouponRequestDto request, CancellationToken cancellationToken = default)
    {
        if(request == null || string.IsNullOrWhiteSpace(request.CouponCode))
        {
            throw new ValidationException("INVALID_REQUEST", "Yêu cầu không hợp lệ");
        }
        if(request.OrderSubtotal <= 0)
        {
            throw new ValidationException("INVALID_ORDER_SUBTOTAL", "Tổng tiền đơn hàng phải lớn hơn 0");
        }
        var cleanCode = request.CouponCode.Trim();
        var coupon = await _dbContext.Coupons.FirstOrDefaultAsync(c => string.Equals(c.CouponCode, cleanCode, StringComparison.OrdinalIgnoreCase), cancellationToken);

        if(coupon == null)
        {
            throw new NotFoundException("COUPON_NOT_FOUND", "Không tìm thấy mã giảm giá");
        }
        if(coupon.EndDate < DateTime.Now)
        {
            throw new ValidationException("COUPON_EXPIRED", "Mã giảm giá đã hết hạn");
        }
        if(!coupon.IsActive)
        {
            throw new ValidationException("COUPON_INACTIVE", "Mã giảm giá không hoạt động");
        }
        if(coupon.QuantityUsed >= coupon.Quantity)
        {
            throw new ValidationException("COUPON_OUT_OF_STOCK", "Mã giảm giá đã hết lượt sử dụng");
        }
        if(request.OrderSubtotal < coupon.MinOrderAmount)
        {
            throw new ValidationException("MIN_ORDER_AMOUNT_NOT_MET", "Tổng tiền đơn hàng chưa đạt yêu cầu tối thiểu");
        }        

        if(DateTime.UtcNow < coupon.StartDate)
        {
            throw new ValidationException("COUPON_NOT_STARTED", "Mã giảm giá chưa bắt đầu");
        }

        var userUsedCount = await _dbContext.CouponHistories.CountAsync(o => o.CouponId == coupon.Id && o.CustomerId == request.CustomerId, cancellationToken); 
        if(userUsedCount >= coupon.MaxUsageUser)
        {
            throw new ValidationException("USER_COUPON_LIMIT_REACHED", "Bạn đã đạt đến giới hạn sử dụng mã này");
        }
        
        decimal discountAmount = 0;
        if(coupon.DiscountType == DiscountTypes.Percentage)
        {
            discountAmount = request.OrderSubtotal * (coupon.DiscountValue /100);
            if(coupon.MaxDiscountAmount.HasValue && discountAmount > coupon.MaxDiscountAmount.Value) //Kiểm tra xem số tiền được giảm có lớn hơn số tiền tối đa được giảm hay không
            {
                discountAmount = coupon.MaxDiscountAmount.Value;
            }
        }
        else
        {
            discountAmount = coupon.DiscountValue;
        }
        
        discountAmount = Math.Min(discountAmount, request.OrderSubtotal);
        discountAmount = Math.Round(discountAmount, 2); //Làm tròn đến 2 chữ số thập phân
        
        decimal finalAmount = Math.Round(request.OrderSubtotal - discountAmount, 2); //Làm tròn đến 2 chữ số thập phân 
        
        return new CouponValidateResultDto
        {
            IsValid = true,
            CouponId = coupon.Id,
            CouponCode = coupon.CouponCode,
            Message = "Áp dụng mã giảm giá thành công",
            DiscountAmount = discountAmount,
            FinalAmount = finalAmount
        };
    }

    public async Task<List<GetCouponItemResult>> GetAvailableCouponsAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var coupons = await _dbContext.Coupons
            .AsNoTracking()
            .Where(c => c.IsActive && c.StartDate <= now && c.EndDate >= now && c.QuantityUsed < c.Quantity)
            .OrderByDescending(c => c.DiscountValue)
            .ToListAsync(cancellationToken);

        return coupons.Select(c => new GetCouponItemResult
        {
            CouponId = c.Id,
            CouponCode = c.CouponCode,
            Description = c.Description,
            DiscountType = c.DiscountType,
            DiscountValue = c.DiscountValue,
            MinOrderAmount = c.MinOrderAmount,
            MaxDiscountAmount = c.MaxDiscountAmount,
            Quantity = c.Quantity,
            QuantityUsed = c.QuantityUsed,
            MaxUsageUser = c.MaxUsageUser,
            StartDate = c.StartDate,
            EndDate = c.EndDate,
            IsActive = c.IsActive
        }).ToList();
    }

    public async Task<GetCouponsResult> GetCouponsAsync(GetCouponsDto query, CancellationToken cancellationToken = default)
    {
        var dbQuery = _dbContext.Coupons.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            var kw = query.Keyword.Trim();
            dbQuery = dbQuery.Where(c => c.CouponCode.Contains(kw) || (c.Description != null && c.Description.Contains(kw)));
        }

        if (query.IsActive.HasValue)
        {
            dbQuery = dbQuery.Where(c => c.IsActive == query.IsActive.Value);
        }

        int totalItems = await dbQuery.CountAsync(cancellationToken);
        int pageNumber = query.PageNumber > 0 ? query.PageNumber : 1;
        int pageSize = query.PageSize > 0 ? query.PageSize : 10;
        int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var items = await dbQuery
            .OrderByDescending(c => c.Id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new GetCouponItemResult
            {
                CouponId = c.Id,
                CouponCode = c.CouponCode,
                Description = c.Description,
                DiscountType = c.DiscountType,
                DiscountValue = c.DiscountValue,
                MinOrderAmount = c.MinOrderAmount,
                MaxDiscountAmount = c.MaxDiscountAmount,
                Quantity = c.Quantity,
                QuantityUsed = c.QuantityUsed,
                MaxUsageUser = c.MaxUsageUser,
                StartDate = c.StartDate,
                EndDate = c.EndDate,
                IsActive = c.IsActive
            })
            .ToListAsync(cancellationToken);

        return new GetCouponsResult
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalPages
        };
    }

    public async Task<GetCouponDetailResult> GetCouponByIdAsync(int couponId, CancellationToken cancellationToken = default)
    {
        var coupon = await _dbContext.Coupons
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == couponId, cancellationToken);

        if (coupon == null)
        {
            throw new NotFoundException("COUPON_NOT_FOUND", "Không tìm thấy mã giảm giá.");
        }

        return new GetCouponDetailResult
        {
            CouponId = coupon.Id,
            CouponCode = coupon.CouponCode,
            Description = coupon.Description,
            DiscountType = coupon.DiscountType,
            DiscountValue = coupon.DiscountValue,
            MinOrderAmount = coupon.MinOrderAmount,
            MaxDiscountAmount = coupon.MaxDiscountAmount,
            Quantity = coupon.Quantity,
            QuantityUsed = coupon.QuantityUsed,
            MaxUsageUser = coupon.MaxUsageUser,
            StartDate = coupon.StartDate,
            EndDate = coupon.EndDate,
            IsActive = coupon.IsActive
        };
    }

    public async Task<CreateCouponResult> CreateCouponAsync(CreateCouponDto request, CancellationToken cancellationToken = default)
    {
        var codeUpper = request.CouponCode.Trim().ToUpperInvariant();
        bool exists = await _dbContext.Coupons.AnyAsync(c => string.Equals(c.CouponCode, codeUpper, StringComparison.OrdinalIgnoreCase), cancellationToken);
        if (exists)
        {
            throw new ValidationException("COUPON_EXISTS", $"Mã giảm giá '{codeUpper}' đã tồn tại trong hệ thống.");
        }

        var coupon = new Coupon
        {
            CouponCode = codeUpper,
            Description = request.Description,
            DiscountType = request.DiscountType,
            DiscountValue = request.DiscountValue,
            MinOrderAmount = request.MinOrderAmount,
            MaxDiscountAmount = request.MaxDiscountAmount,
            Quantity = request.Quantity,
            QuantityUsed = 0,
            MaxUsageUser = request.MaxUsageUser > 0 ? request.MaxUsageUser : 1,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            IsActive = request.IsActive
        };

        _dbContext.Coupons.Add(coupon);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new CreateCouponResult
        {
            CouponId = coupon.Id,
            CouponCode = coupon.CouponCode,
            Description = coupon.Description,
            DiscountType = coupon.DiscountType,
            DiscountValue = coupon.DiscountValue,
            MinOrderAmount = coupon.MinOrderAmount,
            MaxDiscountAmount = coupon.MaxDiscountAmount,
            Quantity = coupon.Quantity,
            QuantityUsed = coupon.QuantityUsed,
            MaxUsageUser = coupon.MaxUsageUser,
            StartDate = coupon.StartDate,
            EndDate = coupon.EndDate,
            IsActive = coupon.IsActive
        };
    }

    public async Task<UpdateCouponResult> UpdateCouponAsync(int couponId, UpdateCouponDto request, CancellationToken cancellationToken = default)
    {
        var coupon = await _dbContext.Coupons.FirstOrDefaultAsync(c => c.Id == couponId, cancellationToken);
        if (coupon == null)
        {
            throw new NotFoundException("COUPON_NOT_FOUND", "Không tìm thấy mã giảm giá.");
        }

        var codeUpper = request.CouponCode.Trim().ToUpperInvariant();
        bool exists = await _dbContext.Coupons.AnyAsync(c => c.Id != couponId && string.Equals(c.CouponCode, codeUpper, StringComparison.OrdinalIgnoreCase), cancellationToken);
        if (exists)
        {
            throw new ValidationException("COUPON_EXISTS", $"Mã giảm giá '{codeUpper}' đã được sử dụng bởi mã khác.");
        }

        coupon.CouponCode = codeUpper;
        coupon.Description = request.Description;
        coupon.DiscountType = request.DiscountType;
        coupon.DiscountValue = request.DiscountValue;
        coupon.MinOrderAmount = request.MinOrderAmount;
        coupon.MaxDiscountAmount = request.MaxDiscountAmount;
        coupon.Quantity = request.Quantity;
        coupon.MaxUsageUser = request.MaxUsageUser;
        coupon.StartDate = request.StartDate;
        coupon.EndDate = request.EndDate;
        coupon.IsActive = request.IsActive;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new UpdateCouponResult
        {
            CouponId = coupon.Id,
            IsSuccess = true,
            Message = "Cập nhật thông tin mã giảm giá thành công."
        };
    }

    public async Task<bool> ToggleCouponStatusAsync(int couponId, CancellationToken cancellationToken = default)
    {
        var coupon = await _dbContext.Coupons.FirstOrDefaultAsync(c => c.Id == couponId, cancellationToken);
        if (coupon == null)
        {
            throw new NotFoundException("COUPON_NOT_FOUND", "Không tìm thấy mã giảm giá.");
        }

        coupon.IsActive = !coupon.IsActive;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return coupon.IsActive;
    }

    public async Task<bool> RecordCouponUsageAsync(int couponId, int customerId, int orderId, decimal originalAmount, decimal discountAmount, CancellationToken cancellationToken = default)
    {
        var coupon = await _dbContext.Coupons.FirstOrDefaultAsync(c => c.Id == couponId, cancellationToken);
        if (coupon == null) return false;

        coupon.QuantityUsed += 1;

        var history = new CouponHistory
        {
            CouponId = couponId,
            CustomerId = customerId,
            OrderId = orderId,
            DiscountAmount = discountAmount,
            OriginalAmount = originalAmount,
            FinalAmount = originalAmount - discountAmount,
            UsedAt = DateTime.UtcNow
        };

        _dbContext.CouponHistories.Add(history);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}