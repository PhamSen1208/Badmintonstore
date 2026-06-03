namespace BadmintonStores.Api.Responses.Auth;

public class AuthUserResponse
{
    public int UserId {get; set;}
    public int? CustomerId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Role { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? FullName { get; set; }
}