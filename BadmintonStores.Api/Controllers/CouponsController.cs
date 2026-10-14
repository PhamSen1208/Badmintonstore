using System.Security.Claims;
using BadmintonStores.Api.Requests.Coupons;
using BadmintonStores.Api.Responses;
using BadmintonStores.Api.Responses.Coupons;
using BadmintonStores.Application.Common.Security;
using BadmintonStores.Application.DTOs.Coupons;
using BadmintonStores.Application.Interfaces;
using BadmintonStores.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BadmintonStores.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CouponsController : ControllerBase
{
    private readonly ICouponService _couponService;
    private readonly AppDbContext _context;

    public CouponsController(ICouponService couponService, AppDbContext context)
    {
        _couponService = couponService;
        _context = context;
    }

    // 1. Admin: Lấy danh sách mã giảm giá có phân trang & tìm kiếm
    [Authorize(Roles = RoleNames.AdminOrStaff)]
    [HttpGet]
    public async Task<ActionResult<ApiResponse<GetCouponsResponse>>> GetCoupons([FromQuery] GetCouponsRequest request, CancellationToken cancellationToken)
    {
        var dto = new GetCouponsDto
        {
            Keyword = request.Keyword,
            IsActive = request.IsActive,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
        };

        var result = await _couponService.GetCouponsAsync(dto, cancellationToken);

        var response = new GetCouponsResponse
        {
            PageNumber = result.PageNumber,
            PageSize = result.PageSize,
            TotalItems = result.TotalItems,
            TotalPages = result.TotalPages,
            Items = result.Items.Select(c => new CouponResponse
            {
                CouponId = c.CouponId,
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
            }).ToList()
        };

        return Ok(ApiResponse<GetCouponsResponse>.Ok(response, "Lấy danh sách mã giảm giá thành công."));
    }

    // 2. Client: Khách áp dụng mã ở trang Checkout
    [Authorize]
    [HttpPost("validate")]
    public async Task<ActionResult<ApiResponse<CouponValidateResponse>>> ValidateCoupons([FromBody] ValidateCouponRequest request, CancellationToken cancellationToken)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdStr, out var userId))
        {
            return Unauthorized();
        }

        var customer = await _context.Customers.FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);
        if (customer == null)
        {
            return BadRequest();
        }

        var dto = new ValidateCouponRequestDto
        {
            CouponCode = request.CouponCode,
            OrderSubtotal = request.OrderSubtotal,
            CustomerId = customer.Id,
        };

        var result = await _couponService.ValidateAndCalculateCouponAsync(dto, cancellationToken);

        var response = new CouponValidateResponse
        {
            IsValid = result.IsValid,
            CouponId = result.CouponId,
            CouponCode = result.CouponCode,
            Message = result.Message,
            DiscountAmount = result.DiscountAmount,
            FinalAmount = result.FinalAmount
        };

        return Ok(ApiResponse<CouponValidateResponse>.Ok(response, "Xác thực mã giảm giá thành công."));
    }

    // 3. Client: Lấy danh sách mã gợi ý khả dụng tại Checkout
    [HttpGet("available")]
    public async Task<ActionResult<ApiResponse<List<CouponResponse>>>> GetAvailableCoupons(CancellationToken cancellationToken)
    {
        var result = await _couponService.GetAvailableCouponsAsync(cancellationToken);
        var response = result.Select(c => new CouponResponse
        {
            CouponId = c.CouponId,
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

        return Ok(ApiResponse<List<CouponResponse>>.Ok(response, "Lấy danh sách mã giảm giá khả dụng thành công."));
    }

    // 4. Admin: Xem chi tiết 1 mã giảm giá theo ID
    [Authorize(Roles = RoleNames.AdminOrStaff)]
    [HttpGet("{couponId:int}")]
    public async Task<ActionResult<ApiResponse<CouponResponse>>> GetCouponById(int couponId, CancellationToken cancellationToken)
    {
        var result = await _couponService.GetCouponByIdAsync(couponId, cancellationToken);
        var response = new CouponResponse
        {
            CouponId = result.CouponId,
            CouponCode = result.CouponCode,
            Description = result.Description,
            DiscountType = result.DiscountType,
            DiscountValue = result.DiscountValue,
            MinOrderAmount = result.MinOrderAmount,
            MaxDiscountAmount = result.MaxDiscountAmount,
            Quantity = result.Quantity,
            QuantityUsed = result.QuantityUsed,
            MaxUsageUser = result.MaxUsageUser,
            StartDate = result.StartDate,
            EndDate = result.EndDate,
            IsActive = result.IsActive
        };

        return Ok(ApiResponse<CouponResponse>.Ok(response, "Lấy thông tin mã giảm giá thành công."));
    }

    // 5. Admin: Tạo mã giảm giá mới
    [Authorize(Roles = RoleNames.AdminOrStaff)]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<CouponResponse>>> CreateCoupon([FromBody] CreateCouponRequest request, CancellationToken cancellationToken)
    {
        var dto = new CreateCouponDto
        {
            CouponCode = request.CouponCode,
            Description = request.Description,
            DiscountType = request.DiscountType,
            DiscountValue = request.DiscountValue,
            MinOrderAmount = request.MinOrderAmount,
            MaxDiscountAmount = request.MaxDiscountAmount,
            Quantity = request.Quantity,
            MaxUsageUser = request.MaxUsageUser,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            IsActive = request.IsActive
        };

        var result = await _couponService.CreateCouponAsync(dto, cancellationToken);
        var response = new CouponResponse
        {
            CouponId = result.CouponId,
            CouponCode = result.CouponCode,
            Description = result.Description,
            DiscountType = result.DiscountType,
            DiscountValue = result.DiscountValue,
            MinOrderAmount = result.MinOrderAmount,
            MaxDiscountAmount = result.MaxDiscountAmount,
            Quantity = result.Quantity,
            QuantityUsed = result.QuantityUsed,
            MaxUsageUser = result.MaxUsageUser,
            StartDate = result.StartDate,
            EndDate = result.EndDate,
            IsActive = result.IsActive
        };

        return Ok(ApiResponse<CouponResponse>.Ok(response, "Tạo mã giảm giá thành công."));
    }

    // 6. Admin: Sửa thông tin mã giảm giá
    [Authorize(Roles = RoleNames.AdminOrStaff)]
    [HttpPut("{couponId:int}")]
    public async Task<ActionResult<ApiResponse<bool>>> UpdateCoupon(int couponId, [FromBody] UpdateCouponRequest request, CancellationToken cancellationToken)
    {
        var dto = new UpdateCouponDto
        {
            CouponCode = request.CouponCode,
            Description = request.Description,
            DiscountType = request.DiscountType,
            DiscountValue = request.DiscountValue,
            MinOrderAmount = request.MinOrderAmount,
            MaxDiscountAmount = request.MaxDiscountAmount,
            Quantity = request.Quantity,
            MaxUsageUser = request.MaxUsageUser,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            IsActive = request.IsActive
        };

        var result = await _couponService.UpdateCouponAsync(couponId, dto, cancellationToken);
        return Ok(ApiResponse<bool>.Ok(result.IsSuccess, result.Message));
    }

    // 7. Admin: Bật/Tắt trạng thái kích hoạt mã giảm giá
    [Authorize(Roles = RoleNames.AdminOrStaff)]
    [HttpPatch("{couponId:int}/toggle")]
    public async Task<ActionResult<ApiResponse<bool>>> ToggleCouponStatus(int couponId, CancellationToken cancellationToken)
    {
        var newStatus = await _couponService.ToggleCouponStatusAsync(couponId, cancellationToken);
        string message = newStatus ? "Đã kích hoạt mã giảm giá." : "Đã tạm ẩn mã giảm giá.";
        return Ok(ApiResponse<bool>.Ok(newStatus, message));
    }
}
