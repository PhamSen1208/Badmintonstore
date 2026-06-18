using BadmintonStores.Application.DTOs.Auth;

namespace BadmintonStores.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResult> LoginAsync(LoginDto loginDto, string? ipAddress, CancellationToken cancellationToken = default);
    Task<AuthResult> RegisterAsync(RegisterDto registerDto, string? ipAddress, CancellationToken cancellationToken = default);
    Task<CurrentUserResult> GetCurrentUserAsync(int userId, CancellationToken cancellationToken = default);
    Task<AuthResult> RefreshTokenAsync(string refreshToken, string? ipAddress, CancellationToken cancellationToken = default);
    Task LogoutAsync(string? refreshToken, string? ipAddress, CancellationToken cancellationToken = default);
}