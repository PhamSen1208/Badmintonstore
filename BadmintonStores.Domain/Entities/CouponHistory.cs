namespace BadmintonStores.Domain.Entities;

public class CouponHistory
{
    public int Id { get; set; }
    public int CouponId { get; set; }
    public int CustomerId { get; set; }
    public int OrderId { get; set; }
    public decimal DiscountAmount {get; set;}
    public decimal OriginalAmount {get; set;}
    public decimal FinalAmount {get; set;}
    public DateTime UsedAt { get; set; }   

    public Coupon Coupon {get; set;} = null!;
    public Customer Customer {get; set;} = null!;
    public Order Order {get; set;} = null!;
}