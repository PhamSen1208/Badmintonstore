namespace BadmintonStores.Application.DTOs.Coupons;

public class ValidateCouponRequestDto
{
    public string CouponCode { get; set; } = string.Empty;
    public decimal OrderSubtotal { get; set; }
    public int CustomerId { get; set; }
}
