using BadmintonStores.Domain.Enums;

namespace BadmintonStores.Domain.Entities;

public class User
{
    public int Id { get; set; }

    public string Email {get; set;} = string.Empty;
    public string? Phone {get; set;}
    public string PasswordHash {get; set;} = string.Empty;
    
    public UserRole Role {get; set;}
    public UserStatus Status {get; set;} = UserStatus.Active;

    public DateTime CreatedAt {get; set;}
    public DateTime? UpdatedAt {get; set;}

    public Customer? Customer {get; set;}

}