using BadmintonStores.Application.Common.Exceptions;
using BadmintonStores.Application.DTOs.Auth;
using BadmintonStores.Application.Interfaces;
using BadmintonStores.Domain.Entities;
using BadmintonStores.Domain.Enums;
using BadmintonStores.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BadmintonStores.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _dbContext; 
    private readonly IPasswordHasherService _passwordHasherService;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthService(AppDbContext dbContext, IPasswordHasherService passwordHasherService, IJwtTokenService jwtTokenService)
    {
        _dbContext = dbContext;
        _passwordHasherService = passwordHasherService;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<AuthResult> RegisterAsync(RegisterDto request, CancellationToken cancellationToken = default)
    {
        ValidateRegisterRequest(request);

        var email = request.Email.Trim().ToLowerInvariant();
        var emailExists = await _dbContext.Users.AnyAsync(u => u.Email == email, cancellationToken);

        if(emailExists)
        {
            throw new ValidationException("EMAIL_EXISTS", "Email đã tồn tại");
        }

        var user = new User
        {
            Email = email,
            Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim(),
            Role = UserRole.Customer,
            Status = UserStatus.Active,
            CreatedAt = DateTime.UtcNow
        };
        //Hash password trước khi lưu vào database
        user.PasswordHash = _passwordHasherService.HashPassword(user, request.Password);

        var customer = new Customer
        {
            User = user,
            CustomerCode = await GenerateCustomerCodeAsync(cancellationToken),
            FullName = request.FullName.Trim(),
            DateOfBirth = request.DateOfBirth,
            Gender = ParseGender(request.Gender),
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Users.Add(user);
        _dbContext.Customers.Add(customer); 
        await _dbContext.SaveChangesAsync(cancellationToken);

        //Tạo JWT chứa thông tin user sau khi đăng ký thành công để trả về cho client
        var accessToken = _jwtTokenService.GenerateAccessToken(user);

        return new AuthResult
        {
            AccessToken = accessToken.AccessToken,
            ExpiresAt = accessToken.ExpiresAt,
            User = new AuthUserResult
            {
                UserId = user.Id,
                CustomerId = customer.Id,
                Email = user.Email,
                Phone = user.Phone,
                Role = user.Role.ToString().ToLowerInvariant(),
                Status = user.Status.ToString().ToLowerInvariant(),
                FullName = customer.FullName
            }
        };
    }
    public async Task<AuthResult> LoginAsync(LoginDto request, CancellationToken cancellationToken = default)
    {
        ValidateLoginRequest(request);
        var email = request.Email.Trim().ToLowerInvariant();
        //Tìm user theo email đã đăng nhập
        var user = await _dbContext.Users.Include(u => u.Customer)
            .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
        if(user == null)
        {
            throw new ValidationException("INVALID_CREDENTIALS", "Email hoặc mật khẩu không đúng");
        }
        if(user.Status != UserStatus.Active)
        {
            throw new ValidationException("USER_INACTIVE", "Tài khoản của bạn đang bị khóa. Vui lòng liên hệ quản trị viên.");
        }
        //Kiểm tra mật khẩu
        var passwordValid = _passwordHasherService.VerifyPassword(user,user.PasswordHash ,request.Password);
        if(!passwordValid)
        {
            throw new ValidationException("INVALID_CREDENTIALS", "Email hoặc mật khẩu không đúng");
        }
        //Tạo JWT chứa thông tin user sau khi đăng nhập thành công để trả về cho client
        var accessToken = _jwtTokenService.GenerateAccessToken(user);

        return new AuthResult
        {
            AccessToken = accessToken.AccessToken,
            ExpiresAt = accessToken.ExpiresAt,
            User = new AuthUserResult
            {
                UserId = user.Id,
                CustomerId = user.Customer?.Id,
                Email = user.Email,
                Phone = user.Phone,
                Role = user.Role.ToString().ToLowerInvariant(),
                Status = user.Status.ToString().ToLowerInvariant(),
                FullName = user.Customer?.FullName
            }
        };
    }

    private static void ValidatePassword(string password)
    {
        if(string.IsNullOrWhiteSpace(password))
        {
            throw new ValidationException("PASSWORD_REQUIRED", "Mật khẩu là bắt buộc");
        }
        if(password.Length < 8)
        {
            throw new ValidationException("PASSWORD_TOO_SHORT", "Mật khẩu phải có ít nhất 8 ký tự");
        }
        if(!password.Any(char.IsUpper))
        {
            throw new ValidationException("PASSWORD_UPPERCASE_REQUIRED", "Mật khẩu phải chứa ít nhất một ký tự viết hoa");
        }
        if(!password.Any(char.IsLower))
        {
            throw new ValidationException("PASSWORD_LOWERCASE_REQUIRED", "Mật khẩu phải chứa ít nhất một ký tự viết thường");
        }
        if(!password.Any(char.IsDigit))
        {
            throw new ValidationException("PASSWORD_DIGIT_REQUIRED", "Mật khẩu phải chứa ít nhất một ký tự số");
        }
        if(!password.Any(ch => !char.IsLetterOrDigit(ch)))
        {
            throw new ValidationException("PASSWORD_SPECIAL_CHAR_REQUIRED", "Mật khẩu phải chứa ít nhất một ký tự đặc biệt");
        }
    }

    private static void ValidateEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            throw new ValidationException("EMAIL_REQUIRED", "Email là bắt buộc.");
        }

        var normalizedEmail = email.Trim();

        if (normalizedEmail.Length > 255)
        {
            throw new ValidationException("EMAIL_TOO_LONG", "Email không được vượt quá 255 ký tự.");
        }

        if (!IsValidEmail(normalizedEmail))
        {
            throw new ValidationException("INVALID_EMAIL", "Email không hợp lệ.");
        }
    }

    private static bool IsValidEmail(string email)
    {
        try
        {
            var mailAddress = new System.Net.Mail.MailAddress(email);

            return mailAddress.Address == email;
        }
        catch
        {
            return false;
        }
    }

    private static void ValidateRegisterRequest(RegisterDto request)
    {
        ValidateEmail(request.Email);
        ValidatePassword(request.Password);

        if(string.IsNullOrWhiteSpace(request.FullName))
        {
            throw new ValidationException("FULLNAME_REQUIRED", "Họ tên là bắt buộc");
        }
        if(request.FullName.Length > 255)
        {
            throw new ValidationException("FULLNAME_TOO_LONG", "Họ tên không được vượt quá 255 ký tự");
        }
        if(!string.IsNullOrWhiteSpace(request.Phone) && request.Phone.Length > 15)
        {
            throw new ValidationException("PHONE_NUMBER_TOO_LONG", "Số điện thoại không được vượt quá 15 ký tự");
        }
    }

    private static void ValidateLoginRequest(LoginDto request)
    {
        ValidateEmail(request.Email);

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            throw new ValidationException("PASSWORD_REQUIRED", "Mật khẩu là bắt buộc.");
        }
    }

    private static Gender ParseGender(string gender)
    {
        if(string.IsNullOrWhiteSpace(gender))
        {
            return Gender.Unknown;
        }
        return gender.Trim().ToLowerInvariant() switch
        {
            "male" => Gender.Male,
            "female" => Gender.Female,
            "other" => Gender.Other,
            "unknown" => Gender.Unknown,
            _ => throw new ValidationException("INVALID_GENDER", "Giới tính không hợp lệ.") 
        };
    }
    private async Task<string> GenerateCustomerCodeAsync(CancellationToken cancellationToken)
    {
        var nextId = await _dbContext.Customers.CountAsync(cancellationToken) + 1;

        return $"CUS{nextId:000000}";
    }

}
