using BadmintonStores.Api.Requests.Products;
using BadmintonStores.Api.Responses;
using BadmintonStores.Api.Responses.Products;
using BadmintonStores.Application.DTOs.Products;
using BadmintonStores.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BadmintonStores.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController (IProductService productService)
    {
        _productService = productService;
    } 

    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest request, CancellationToken cancellationToken)
    {
        //Map CreateProductRequest sang CreateProductDto
        var dto = new CreateProductDto
        {
            ProductCode = request.ProductCode,
            ProductName = request.ProductName,
            BasePrice = request.BasePrice,
            Warranty = request.Warranty,
            Description = request.Description
        };

        var result = await _productService.CreateProductAsync(dto,cancellationToken);// Gửi dữ liệu sản phẩm xuống service, chờ service tạo sản phẩm xong, rồi lấy kết quả trả về.
        var response = new CreateProductResponse
        {
            ProductCode = result.ProductCode,
            ProductName = result.ProductName,
            BasePrice = result.BasePrice,
            Warranty = result.Warranty,
            Description = result.Description,
            CreatedAt = result.CreatedAt
        };
        return Ok(ApiResponse<CreateProductResponse>.Ok(response, "Tạo sản phẩm thành công"));
    }

    [HttpGet("{productId:int}")]
    public async Task<IActionResult> GetProductDetail( int productId, CancellationToken cancellationToken)
    {
        var result = await _productService.GetProductByIdAsync(productId, cancellationToken);
        var response = new GetProductDetailResponse
        {
            ProductId = result.ProductId,
            ProductCode = result.ProductCode,
            ProductName = result.ProductName,
            BasePrice = result.BasePrice,
            Description = result.Description,
            Warranty = result.Warranty,
            Status = result.Status,
            CreatedAt = result.CreatedAt,
            UpdatedAt = result.UpdatedAt
        };

        return Ok(ApiResponse<GetProductDetailResponse>.Ok(response, "Lấy thông tin sản phẩm thành công."));
    }

    [HttpPatch("{productId:int}")]
    public async Task<IActionResult> UpdateProduct([FromRoute]int productId, [FromBody] UpdateProductRequest request, CancellationToken cancellationToken)
    {
        //Map UpdateProductRequest sang UpdateProductDto
        var dto = new UpdateProductDto
        {
            ProductId = productId,
            ProductName = request.ProductName,
            BasePrice = request.BasePrice,
            Description = request.Description,
            Warranty = request.Warranty
        };

        var result = await _productService.UpdateProductAsync(dto, cancellationToken);
        var response = new UpdateProductResponse
        {
            ProductId = result.ProductId,
            ProductCode = result.ProductCode,
            ProductName = result.ProductName,
            BasePrice = result.BasePrice,
            Description = result.Description,
            Warranty = result.Warranty,
            Status = result.Status,
            UpdatedAt = result.UpdatedAt  
        };
        return Ok(ApiResponse<UpdateProductResponse>.Ok(response, "Cập nhật sản phẩm thành công"));
    }

    [HttpPatch("{productId:int}/status")]
    public async Task<IActionResult> UpdateProductStatus(int productId, [FromBody] UpdateProductStatusDto request, CancellationToken cancellationToken)
    {
        var dto = new UpdateProductStatusDto
        {
            ProductId = productId,
            Status = request.Status
        };

        var result = await _productService.UpdateProductStatusAsync(dto, cancellationToken);
        var response = new UpdateProductStatusResponse
        {
            ProductId = result.ProductId,
            ProductCode = result.ProductCode,
            Status = result.Status,
            UpdatedAt = result.UpdatedAt
        };

        return Ok(ApiResponse<UpdateProductStatusResponse>.Ok(response, "Cập nhật trạng thái sản phẩm thành công"));
    }
}
