using BadmintonStores.Application.DTOs.Auth;

namespace BadmintonStores.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResult> LoginAsync(LoginDto loginDto, CancellationToken cancellationToken = default);
    Task<AuthResult> RegisterAsync(RegisterDto registerDto, CancellationToken cancellationToken = default);
    Task<CurrentUserResult> GetCurrentUserAsync(int userId, CancellationToken cancellationToken = default);
}