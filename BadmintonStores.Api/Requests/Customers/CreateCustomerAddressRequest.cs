namespace BadmintonStores.Api.Requests.Customers;

public class CreateCustomerAddressRequest
{
    public int CustomerId { get; set; }
    public string RecipientName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Ward { get; set; } = string.Empty;
    public string AddressDetail { get; set; } = string.Empty;
    public bool IsDefault { get; set; }
}
