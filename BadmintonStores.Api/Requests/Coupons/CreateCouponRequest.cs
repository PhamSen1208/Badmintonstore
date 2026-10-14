using System.ComponentModel.DataAnnotations;
using BadmintonStores.Domain.Enums;

namespace BadmintonStores.Api.Requests.Coupons;

public class CreateCouponRequest
{
    [Required(ErrorMessage = "Mã giảm giá không được để trống")]
    public string CouponCode { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DiscountTypes DiscountType { get; set; } = DiscountTypes.Percentage;

    [Range(0, double.MaxValue, ErrorMessage = "Giá trị giảm không hợp lệ")]
    public decimal DiscountValue { get; set; }

    public decimal MinOrderAmount { get; set; }

    public decimal? MaxDiscountAmount { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Số lượng phải lớn hơn 0")]
    public int Quantity { get; set; }

    public int MaxUsageUser { get; set; } = 1;

    public DateTime StartDate { get; set; } = DateTime.UtcNow;

    public DateTime EndDate { get; set; }

    public bool IsActive { get; set; } = true;
}
