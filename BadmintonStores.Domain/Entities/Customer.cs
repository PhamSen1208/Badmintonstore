using BadmintonStores.Domain.Enums;

namespace BadmintonStores.Domain.Entities;

public class Customer
{
    public int Id {get; set;}
    public int UserId {get ; set;}

    public string CustomerCode {get; set;} = string.Empty;
    public string FullName {get; set;} = string.Empty;

    public DateOnly? DateOfBirth {get; set;}
    public Gender Gender {get; set;} = Gender.Unknown;

    public DateTime CreatedAt {get; set;}
    public DateTime? UpdatedAt {get; set;}

    public User User {get; set;} = null!; // 1 customer chỉ có 1 user
    public ICollection<Order> Orders {get; set;} = new List<Order>(); // 1 customer có thể có nhiều order
}