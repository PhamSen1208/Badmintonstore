using System.ComponentModel.DataAnnotations;
using BadmintonStores.Domain.Enums;

namespace BadmintonStores.Application.DTOs.Coupons;

public class UpdateCouponDto
{
    public string CouponCode { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DiscountTypes DiscountType { get; set; }

    public decimal DiscountValue { get; set; }

    public decimal MinOrderAmount { get; set; }

    public decimal? MaxDiscountAmount { get; set; }

    public int Quantity { get; set; }

    public int MaxUsageUser { get; set; } = 1;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public bool IsActive { get; set; }
}