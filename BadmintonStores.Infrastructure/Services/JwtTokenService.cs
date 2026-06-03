using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BadmintonStores.Application.Common.Settings;
using BadmintonStores.Application.DTOs.Auth;
using BadmintonStores.Application.Interfaces;
using BadmintonStores.Domain.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace BadmintonStores.Infrastructure.Services;

//Service này sẽ nhận User rồi tạo JWT chứa thông tin user như UserId, Email, Role,...
//Chuyên tạo Token khi user đăng nhập thành công, sau đó trả token này về cho client để client sử dụng trong các request tiếp theo để xác thực và phân quyền    
public class JwtTokenService : IJwtTokenService
{
    private readonly JwtSettings _jwtSettings;

    public JwtTokenService(IOptions<JwtSettings> jwtOptions)
    {
        _jwtSettings = jwtOptions.Value;
    }
    public AccessTokenResult GenerateAccessToken(User user)
    {
        //Tính thời gian hết hạn của token dựa trên cấu hình trong appsettings.json
        var expireAt = DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenMinutes);

        //Tạo danh sách claims chứa thông tin của user để đưa vào token
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        //Tạo khóa ký token từ secret key đã cấu hình trong appsettings.json
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));

        //Tạo thông tin xác thực (credentials) sử dụng thuật toán HMAC SHA256 với khóa ký đã tạo
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        //Tạo token JWT với các thông tin đã chuẩn bị
        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: expireAt,
            signingCredentials: credentials
        );

        //Chuyển token thành chuỗi để trả về cho client
        var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

        return new AccessTokenResult
        {
            AccessToken = accessToken,
            ExpiresAt = expireAt
        };
    }
}