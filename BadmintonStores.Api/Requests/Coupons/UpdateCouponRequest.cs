using System.ComponentModel.DataAnnotations;
using BadmintonStores.Domain.Enums;

namespace BadmintonStores.Api.Requests.Coupons;

public class UpdateCouponRequest
{
    [Required(ErrorMessage = "Mã giảm giá không được để trống")]
    public string CouponCode { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DiscountTypes DiscountType { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Giá trị giảm không hợp lệ")]
    public decimal DiscountValue { get; set; }

    public decimal MinOrderAmount { get; set; }

    public decimal? MaxDiscountAmount { get; set; }

    public int Quantity { get; set; }

    public int MaxUsageUser { get; set; } = 1;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public bool IsActive { get; set; }
}
