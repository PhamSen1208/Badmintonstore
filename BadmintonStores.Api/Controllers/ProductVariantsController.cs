using BadmintonStores.Api.Requests.ProductVariants;
using BadmintonStores.Api.Responses;
using BadmintonStores.Api.Responses.ProductVariants;
using BadmintonStores.Application.DTOs.ProductVariants;
using BadmintonStores.Application.Interfaces;
using BadmintonStores.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BadmintonStores.Api.Controllers;

[ApiController]
[Route("api")]
public class ProductVariantsController : ControllerBase
{
    private readonly IProductVariantService _productVariantService;
    public ProductVariantsController(IProductVariantService service)
    {
        _productVariantService = service;
    }

    [HttpPost("products/{productId:int}/variants")]
    public async Task<IActionResult> CreateProductVariant([FromRoute] int productId, [FromBody] CreateProductVariantRequest request, CancellationToken cancellationToken)
    {
        //Map request -> dto
        var dto = new CreateProductVariantDto
        {
            ProductId = productId,
            SKU = request.SKU,
            Price = request.Price,
            SalePrice = request.SalePrice,
            Weight = request.Weight,
            Color = request.Color,
            Size = request.Size,
        };

        var result = await _productVariantService.CreateProductVariantAsync(dto, cancellationToken);
        var response = new CreateProductVariantResponse
        {
            ProductVariantId = result.ProductVariantId,
            ProductId = result.ProductId,
            SKU = result.SKU,
            Price = result.Price,
            SalePrice = result.SalePrice,
            Weight = result.Weight,
            Color = result.Color,
            Size = result.Size,
            Status = result.Status,
            CreatedAt = result.CreatedAt
        };
        return Ok(ApiResponse<CreateProductVariantResponse>.Ok(response, "Thêm mới thuộc tính sản phẩm thành công"));
    }

    [HttpGet("product-variants/{productVariantId:int}")]   
    public async Task<IActionResult> GetProductVariantDetail(int productVariantId, CancellationToken cancellationToken)
    {
        var result = await _productVariantService.GetProductVariantByIdAsync(productVariantId, cancellationToken);
        var response = new GetProductVariantDetailResponse
        {
            ProductVariantId = result.ProductVariantId,
            ProductId = result.ProductId,
            ProductCode = result.ProductCode,
            ProductName = result.ProductName,
            SKU = result.SKU,
            Price = result.Price,
            SalePrice = result.SalePrice,
            Weight = result.Weight,
            Color = result.Color,
            Size = result.Size,
            Status = result.Status,
            CreatedAt = result.CreatedAt,
            UpdatedAt = result.UpdatedAt   
        };
        return Ok(ApiResponse<GetProductVariantDetailResponse>.Ok(response,"Xem chi tiết thuộc tính sản phẩm thành công"));
    }
    [HttpGet("products/{productId:int}/variants")]
    public async Task<IActionResult> GetProductVariants([FromRoute] int productId, [FromQuery] GetProductVariantsRequest request, CancellationToken cancellationToken)
    {
        var query = new GetProductVariantsQuery
        {
            ProductId = productId,
            Keyword = request.Keyword,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            Status = request.Status
        };

        var result = await _productVariantService.GetProductVariantsAsync(query,cancellationToken);
        var response = new GetProductVariantResponse
        {
            ProductId = productId,
            ProductCode = result.ProductCode,
            ProductName = result.ProductName,
            Items = result.Items.Select(v => new GetProductVariantItemsResponse
            {
                ProductVariantId = v.ProductVariantId,
                SKU = v.SKU,
                Price = v.Price,
                SalePrice = v.SalePrice,
                Weight = v.Weight,
                Color = v.Color,
                Size = v.Size,
                Status = v.Status,
                CreatedAt = v.CreatedAt,
                UpdatedAt = v.UpdatedAt
            }).ToList(),
            PageNumber = result.PageNumber,
            PageSize = result.PageSize,
            TotalPages = result.TotalPages,
            TotalItems = result.TotalItems
        };
        return Ok(ApiResponse<GetProductVariantResponse>.Ok(response, "Lấy danh sách thuộc tính thành công"));
    }

    [HttpPatch("product-variants/{productVariantId:int}")]
    public async Task<IActionResult> UpdateProductVariant([FromRoute] int productVariantId, [FromBody] UpdateProductVariantRequest request, CancellationToken cancellationToken)
    {
        //Map request -> dto
        var dto = new UpdateProductVariantDto
        {
            ProductVariantId = productVariantId,
            Price = request.Price,
            SalePrice = request.SalePrice,
            Weight = request.Weight,
            Color = request.Color,
            Size = request.Size
        };

        var result = await _productVariantService.UpdateProductVariantAsync(dto,cancellationToken);
        var response = new UpdateProductVariantResponse
        {
            ProductVariantId = result.ProductVariantId,
            ProductId = result.ProductId,
            ProductCode = result.ProductCode,
            ProductName = result.ProductName,
            SKU = result.SKU,
            Price = result.Price,
            SalePrice = result.SalePrice,
            Color = result.Color,
            Size = result.Size,
            Weight = result.Weight,
            Status = result.Status,
            CreatedAt = result.CreatedAt,
            UpdatedAt = result.UpdatedAt  
        };
        return Ok(ApiResponse<UpdateProductVariantResponse>.Ok(response,"Cập nhật thuộc tính sản phẩm thành công"));
    }

    [HttpPatch("product-variants/{productVariantId:int}/status")]
    public async Task<IActionResult> UpdateProductVariantStatus([FromRoute] int productVariantId, [FromBody] UpdateProductVariantStatusRequest request, CancellationToken cancellationToken)
    {
        //Map request -> dto
        var dto = new UpdateProductVariantStatusDto
        {
            ProductVariantId = productVariantId,
            Status = request.Status
        };

        var result = await _productVariantService.UpdateProductVariantStatusAsync(dto, cancellationToken);
        var response = new UpdateProductVariantStatusResponse
        {
            ProductVariantId = result.ProductVariantId,
            Status = result.Status,
            UpdatedAt = result.UpdatedAt  
        };
        return Ok(ApiResponse<UpdateProductVariantStatusResponse>.Ok(response, "Cập nhật trạng thái thuộc tính sản phẩm thành công"));
    }
}