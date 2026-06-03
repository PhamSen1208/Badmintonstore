using BadmintonStores.Api.Requests.Auth;
using BadmintonStores.Api.Responses;
using BadmintonStores.Api.Responses.Auth;
using BadmintonStores.Application.DTOs.Auth;
using BadmintonStores.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace BadmintonStores.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]  
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Register(RegisterRequest request, CancellationToken cancellationToken)
    {
        var dto = new RegisterDto
        {
            Email = request.Email,
            Phone = request.Phone,
            Password = request.Password,
            FullName = request.FullName,
            DateOfBirth = request.DateOfBirth,
            Gender = request.Gender
        };

        var result = await _authService.RegisterAsync(dto, cancellationToken);

        var response = MapToAuthResponse(result);
        return Ok(ApiResponse<AuthResponse>.Ok(response,"Đăng ký thành công"));
    }

    private static AuthResponse MapToAuthResponse(AuthResult result)
    {
        return new AuthResponse
        {
            AccessToken = result.AccessToken,
            ExpiresAt = result.ExpiresAt,
            User = new AuthUserResponse
            {
                UserId = result.User.UserId,
                CustomerId = result.User.CustomerId,
                Email = result.User.Email,
                Phone = result.User.Phone,
                Role = result.User.Role,
                Status = result.User.Status,
                FullName = result.User.FullName
            }
        };
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        var dto = new LoginDto
        {
            Email = request.Email,
            Password = request.Password
        };

        var result = await _authService.LoginAsync(dto, cancellationToken);

        var response = MapToAuthResponse(result);
        return Ok(ApiResponse<AuthResponse>.Ok(response, "Đăng nhập thành công"));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<ApiResponse<CurrentUserResponse>>> GetMe(CancellationToken cancellationToken)
    {
        //Lấy userId từ claim trong JWT
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdValue, out var userId))
        {
            return Unauthorized();
        }

        var result = await _authService.GetCurrentUserAsync(userId, cancellationToken);
        var response = new CurrentUserResponse
        {
            UserId = result.UserId,
            CustomerId = result.CustomerId,
            Email = result.Email,
            Phone = result.Phone,
            Role = result.Role,
            Status = result.Status,
            FullName = result.FullName
        };
        return Ok(ApiResponse<CurrentUserResponse>.Ok(response,"Lấy thông tin người dùng thành công "));
    }
}