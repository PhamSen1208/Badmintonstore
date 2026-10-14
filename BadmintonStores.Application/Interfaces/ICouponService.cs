using BadmintonStores.Application.DTOs.Coupons;

namespace BadmintonStores.Application.Interfaces;

public interface ICouponService
{
    // 1. Dành cho Client: Kiểm tra & áp dụng mã giảm giá ở Checkout
    Task<CouponValidateResultDto> ValidateAndCalculateCouponAsync(ValidateCouponRequestDto request, CancellationToken cancellationToken = default);

    // 2. Dành cho Client: Lấy danh sách mã giảm giá đang khả dụng (hiển thị gợi ý tại Checkout)
    Task<List<GetCouponItemResult>> GetAvailableCouponsAsync(CancellationToken cancellationToken = default);

    // 3. Dành cho Admin: Lấy danh sách mã có phân trang & tìm kiếm
    Task<GetCouponsResult> GetCouponsAsync(GetCouponsDto query, CancellationToken cancellationToken = default);

    // 4. Dành cho Admin: Xem chi tiết 1 mã
    Task<GetCouponDetailResult> GetCouponByIdAsync(int couponId, CancellationToken cancellationToken = default);

    // 5. Dành cho Admin: Tạo mã mới
    Task<CreateCouponResult> CreateCouponAsync(CreateCouponDto request, CancellationToken cancellationToken = default);

    // 6. Dành cho Admin: Sửa mã
    Task<UpdateCouponResult> UpdateCouponAsync(int couponId, UpdateCouponDto request, CancellationToken cancellationToken = default);

    // 7. Dành cho Admin: Bật/tắt trạng thái mã
    Task<bool> ToggleCouponStatusAsync(int couponId, CancellationToken cancellationToken = default);

    // 8. Dùng nội bộ khi tạo Đơn hàng thành công: Ghi nhận lịch sử dùng coupon
    Task<bool> RecordCouponUsageAsync(int couponId, int customerId, int orderId, decimal originalAmount, decimal discountAmount, CancellationToken cancellationToken = default);
}