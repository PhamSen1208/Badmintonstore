namespace BadmintonStores.Api.Responses.Coupons;

public class GetCouponsResponse
{
    public List<CouponResponse> Items { get; set; } = new();
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
}
