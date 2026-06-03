namespace BadmintonStores.Application.DTOs.Auth;

public class AuthResult
{
    public string AccessToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }

    public AuthUserResult User { get; set; } = new();
}

