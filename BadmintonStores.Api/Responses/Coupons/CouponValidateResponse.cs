namespace BadmintonStores.Api.Responses.Coupons;

public class CouponValidateResponse
{
    public bool IsValid { get; set; }
    public int? CouponId { get; set; }
    public string CouponCode { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public decimal DiscountAmount { get; set; }
    public decimal FinalAmount { get; set; }
}
