namespace BadmintonStores.Api.Requests.Customers;

public class UpdateCustomerRequest
{
    public string FullName { get; set; } = string.Empty;
    public DateOnly? DateOfBirth { get; set; }
    public string Gender { get; set; } = string.Empty;
}