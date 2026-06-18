using System.Security.Cryptography;
using System.Text;
using BadmintonStores.Application.Common.Exceptions;
using BadmintonStores.Application.DTOs.Auth;
using BadmintonStores.Application.Interfaces;
using BadmintonStores.Domain.Entities;
using BadmintonStores.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BadmintonStores.Infrastructure.Services;

public class RefreshTokenService : IRefreshTokenService
{
    private readonly AppDbContext _dbContext;
    private const int RefreshTokenDays = 7;
    public RefreshTokenService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<RefreshTokenResult> CreateRefreshTokenAsync(User user, string? ipAddress, CancellationToken cancellationToken = default)
    {
        var token = GenerateSecureToken();
        var tokenHash = HashToken(token);
        var expiresAt = DateTime.UtcNow.AddDays(RefreshTokenDays);

        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = tokenHash,
            ExpiresAt = expiresAt,
            CreatedAt = DateTime.UtcNow,
            CreatedByIp = ipAddress
        };

        _dbContext.RefreshTokens.Add(refreshToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new RefreshTokenResult
        {
            Token = token,
            ExpiresAt = expiresAt
        };
    }

    public async Task<RefreshTokenRotationResult> RotateRefreshTokenAsync(string refreshToken, string? ipAddress, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
        {
            throw new ValidationException("REFRESH_TOKEN_REQUIRED", "Refresh token là bắt buộc.");
        }

        var tokenHash = HashToken(refreshToken);
        var existingToken = await _dbContext.RefreshTokens.Include(x => x.User).ThenInclude(x => x.Customer).FirstOrDefaultAsync(x => x.TokenHash == tokenHash, cancellationToken);

        if (existingToken == null)
        {
            throw new ValidationException("INVALID_REFRESH_TOKEN", "Refresh token không hợp lệ.");
        }
        if (existingToken.RevokedAt != null)
        {
            throw new ValidationException("REFRESH_TOKEN_REVOKED", "Refresh token đã bị thu hồi.");
        }

        if (existingToken.ExpiresAt <= DateTime.UtcNow)
        {
            throw new ValidationException("REFRESH_TOKEN_EXPIRED", "Refresh token đã hết hạn.");
        }

        if (existingToken.User.Status != Domain.Enums.UserStatus.Active)
        {
            throw new ValidationException("USER_NOT_ACTIVE", "Tài khoản không ở trạng thái hoạt động.");
        }

        var newToken = GenerateSecureToken();
        var newTokenHash = HashToken(newToken);
        var newExpiresAt = DateTime.UtcNow.AddDays(RefreshTokenDays);

        existingToken.RevokedAt = DateTime.UtcNow;
        existingToken.RevokedByIp = ipAddress;
        existingToken.ReplacedByTokenHash = newTokenHash;

        var replacementToken = new RefreshToken
        {
            UserId = existingToken.UserId,
            TokenHash = newTokenHash,
            ExpiresAt = newExpiresAt,
            CreatedAt = DateTime.UtcNow,
            CreatedByIp = ipAddress
        };

        _dbContext.RefreshTokens.Add(replacementToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new RefreshTokenRotationResult
        {
            User = existingToken.User,
            RefreshToken = newToken,
            RefreshTokenExpiresAt = newExpiresAt
        };
    }
    public async Task RevokeRefreshTokenAsync(string refreshToken, string? ipAddress, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
        {
            return;
        }

        var tokenHash = HashToken(refreshToken);

        var existingToken = await _dbContext.RefreshTokens
            .FirstOrDefaultAsync(x => x.TokenHash == tokenHash, cancellationToken);

        if (existingToken == null)
        {
            return;
        }

        if (existingToken.RevokedAt != null)
        {
            return;
        }

        existingToken.RevokedAt = DateTime.UtcNow;
        existingToken.RevokedByIp = ipAddress;

        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private static string GenerateSecureToken()
    {
        var randomBytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(randomBytes);
    }

    private static string HashToken(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(bytes);
    }
}