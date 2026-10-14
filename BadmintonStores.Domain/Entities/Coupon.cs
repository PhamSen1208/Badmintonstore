using BadmintonStores.Domain.Enums;

namespace BadmintonStores.Domain.Entities;


public class Coupon
{
    public int Id { get; set; }
    public string CouponCode { get; set; } = string.Empty; 
    public string Description {get; set;} = string.Empty;
    public DiscountTypes DiscountType { get; set; } = DiscountTypes.Percentage;
    public decimal DiscountValue { get; set; }
    public decimal MinOrderAmount { get; set; }
    public decimal? MaxDiscountAmount { get; set; }
    public int Quantity { get; set; }
    public int QuantityUsed { get; set; }
    public int MaxUsageUser {get; set;} = 1;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; }
}
