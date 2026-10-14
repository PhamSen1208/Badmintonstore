using System.ComponentModel.DataAnnotations;

namespace BadmintonStores.Api.Requests.Coupons;

public class ValidateCouponRequest
{
    [Required(ErrorMessage = "Mã giảm giá không được để trống")]
    public string CouponCode { get; set; } = string.Empty;

    [Range(0, double.MaxValue, ErrorMessage = "Số tiền đơn hàng không hợp lệ")]
    public decimal OrderSubtotal { get; set; }
}
