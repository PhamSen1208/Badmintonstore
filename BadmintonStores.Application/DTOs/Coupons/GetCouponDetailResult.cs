using BadmintonStores.Domain.Enums;

namespace BadmintonStores.Application.DTOs.Coupons;

public class GetCouponDetailResult
{
    public int CouponId { get; set; }
    public string CouponCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DiscountTypes DiscountType { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal MinOrderAmount { get; set; }
    public decimal? MaxDiscountAmount { get; set; }
    public int Quantity { get; set; }
    public int QuantityUsed { get; set; }
    public int MaxUsageUser { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; }
}
