namespace BadmintonStores.Api.Responses.Customers;

public class UpdateCustomerResponse
{
    public int CustomerId { get; set; }
    public int UserId { get; set; }
    public string CustomerCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public DateOnly? DateOfBirth { get; set; }
    public string Gender { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}