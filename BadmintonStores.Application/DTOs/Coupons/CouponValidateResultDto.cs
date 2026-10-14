namespace BadmintonStores.Application.DTOs.Coupons;

public class CouponValidateResultDto
{
    public bool IsValid { get; set; }
    public int? CouponId { get; set; }
    public string CouponCode { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public decimal DiscountAmount { get; set; }
    public decimal FinalAmount { get; set; }
}
