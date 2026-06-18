using BadmintonStores.Domain.Entities;

namespace BadmintonStores.Application.DTOs.Auth;

public class RefreshTokenRotationResult
{
    public User User { get; set; } = null!;

    public string RefreshToken { get; set; } = string.Empty;
    public DateTime RefreshTokenExpiresAt { get; set; }
}