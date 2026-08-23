namespace BadmintonStores.Domain.Entities;

public class CustomerAddress
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string RecipientName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Ward { get; set; } = string.Empty;
    public string AddressDetail { get; set; } = string.Empty;
    public bool IsDefault { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Customer Customer { get; set; } = null!;
}
