namespace BadmintonStores.Api.Requests.Auth;

public class RegisterRequest
{
    public string Email {get; set; } = string.Empty;
    public string?Phone {get; set; }
    public string Password {get; set; } = string.Empty;
    public string FullName {get; set; } = string.Empty;
    public DateOnly? DateOfBirth {get; set; }
    public string Gender {get; set; } = string.Empty;
}
