namespace BadmintonStores.Application.DTOs.Customers;

public class GetCustomerDetailResult
{
    public int CustomerId { get; set; }
    public int UserId { get; set; }
    public string CustomerCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string UserStatus { get; set; } = "Active";
    public DateOnly? DateOfBirth { get; set; }
    public string Gender { get; set; } = string.Empty;
    public int TotalOrders { get; set; }
    public decimal TotalSpent { get; set; }
    public DateTime? LastOrderDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
