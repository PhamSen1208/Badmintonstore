namespace BadmintonStores.Domain.Entities;

public class RefreshToken
{
    public int Id {get; set;}
    public int UserId {get; set;}
    public string TokenHash {get; set;} = string.Empty; //Lưu hash của refresh token để tăng cường bảo mật
    public DateTime ExpiresAt {get; set;}
    public DateTime? RevokedAt  {get; set;} //Thời điểm token được sử dụng để lấy access token mới
    public DateTime CreatedAt {get; set;}

    public string? CreatedByIp { get; set; }
    public string? RevokedByIp { get; set; }

    public string? ReplacedByTokenHash { get; set; } // Khi refresh token cũ bị thay = token mới

    public User User { get; set; } = null!;
}