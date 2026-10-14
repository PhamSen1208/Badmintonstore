using System.Security.Claims;
using BadmintonStores.Api.Responses;
using BadmintonStores.Application.DTOs.WishList;
using BadmintonStores.Application.Interfaces;
using BadmintonStores.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BadmintonStores.Api.Controllers;

[ApiController]
[Route("api/wishlist")]
[Authorize]
public class WishListController : ControllerBase
{
    private readonly IWishListService _wishlistService;
    private readonly AppDbContext _dbContext;

    public WishListController(IWishListService wishlistService, AppDbContext dbContext)
    {
        _wishlistService = wishlistService;
        _dbContext = dbContext;
    }

    private async Task<int> GetCurrentCustomerIdAsync(CancellationToken cancellationToken)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdStr, out var userId)) return 0;
        var customer = await _dbContext.Customers.FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);
        return customer?.Id ?? 0;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<WishListItemDto>>>> GetMyWishlist(CancellationToken cancellationToken)
    {
        var customerId = await GetCurrentCustomerIdAsync(cancellationToken);
        var result = await _wishlistService.GetMyWishlistAsync(customerId, cancellationToken);
        return Ok(ApiResponse<List<WishListItemDto>>.Ok(result, "Lấy danh sách yêu thích thành công"));
    }

    [HttpGet("ids")]
    public async Task<ActionResult<ApiResponse<List<int>>>> GetMyWishlistIds(CancellationToken cancellationToken)
    {
        var customerId = await GetCurrentCustomerIdAsync(cancellationToken);
        var result = await _wishlistService.GetMyWishlistProductIdsAsync(customerId, cancellationToken);
        return Ok(ApiResponse<List<int>>.Ok(result, "Lấy danh sách ID yêu thích thành công"));
    }

    [HttpPost("toggle/{productId:int}")]
    public async Task<ActionResult<ApiResponse<ToggleWishListResult>>> ToggleWishlistAsync(int productId, CancellationToken cancellationToken)
    {
        var customerId = await GetCurrentCustomerIdAsync(cancellationToken);
        var result = await _wishlistService.ToggleWishlistAsync(customerId, productId, cancellationToken);
        return Ok(ApiResponse<ToggleWishListResult>.Ok(result, result.Message));
    }
}