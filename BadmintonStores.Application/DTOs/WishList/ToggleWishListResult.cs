using BadmintonStores.Application.DTOs.WishList;

public class ToggleWishListResult
{
    public int productId {get; set;}
    public bool IsFavorite { get; set; } // true: đã thả tim, false: đã bỏ thả tim
    public string Message { get; set; } = string.Empty; 
}

