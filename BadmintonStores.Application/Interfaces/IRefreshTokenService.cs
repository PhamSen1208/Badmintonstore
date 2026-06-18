using BadmintonStores.Application.DTOs.Auth;
using BadmintonStores.Domain.Entities;

namespace BadmintonStores.Application.Interfaces;
public interface IRefreshTokenService
{
    //Dùng khi regis/login thành công
    Task<RefreshTokenResult> CreateRefreshTokenAsync(User user, string? ipAddress, CancellationToken cancellationToken = default);
    //Dùng khi client call api/auth/refresh. Token cũ bị revoke và token mới đc tạo
    Task<RefreshTokenRotationResult> RotateRefreshTokenAsync(string refreshToken, string? ipAddress, CancellationToken cancellationToken = default);
    //Dùng khi logout
    Task RevokeRefreshTokenAsync(string refreshToken, string? ipAddress, CancellationToken cancellationToken = default);
}