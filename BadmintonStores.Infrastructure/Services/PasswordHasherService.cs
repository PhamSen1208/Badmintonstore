using BadmintonStores.Application.Interfaces;
using BadmintonStores.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace BadmintonStores.Infrastructure.Services;

//Sử dụng PasswordHasher của ASP.NET Core Identity để hash và verify password
//Xử lý password của user khi đăng ký, đăng nhập, đổi mật khẩu,... 
public class PasswordHasherService : IPasswordHasherService
{
    private readonly PasswordHasher<User> _passwordHasher = new();

    public string HashPassword(User user, string password)
    {
        return _passwordHasher.HashPassword(user, password);
    }
    public bool VerifyPassword(User user, string passwordHash, string password)
    {
        //Lấy passwordHash đã lưu trong database, so sánh với password người dùng nhập vào sau khi đã hash và trả về true , false
        var result = _passwordHasher.VerifyHashedPassword(user, passwordHash, password);
        return result == PasswordVerificationResult.Success
        || result == PasswordVerificationResult.SuccessRehashNeeded;
    }
   
}