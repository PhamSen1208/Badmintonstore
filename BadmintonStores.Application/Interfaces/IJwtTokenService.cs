using BadmintonStores.Application.DTOs.Auth;
using BadmintonStores.Domain.Entities;

namespace BadmintonStores.Application.Interfaces;

//Nhận User rồi tạo JWT chứa thông tin user như UserId, Email, Role,...
public interface IJwtTokenService
{
    AccessTokenResult GenerateAccessToken(User user);
}