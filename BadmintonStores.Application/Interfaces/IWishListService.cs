using BadmintonStores.Application.DTOs.WishList;

public interface IWishListService {
    // Lấy danh sách sản phẩm yêu thích
    Task<List<WishListItemDto>> GetMyWishlistAsync(int customerId, CancellationToken cancellationToken = default);
    // Thêm hoặc xóa sản phẩm khỏi danh sách yêu thích
    Task<ToggleWishListResult> ToggleWishlistAsync(int customerId, int productId, CancellationToken cancellationToken = default);
    // Lấy danh sách id sản phẩm yêu thích 
    Task<List<int>> GetMyWishlistProductIdsAsync(int customerId, CancellationToken cancellationToken = default);
}