using BadmintonStores.Application.DTOs.Products;

namespace BadmintonStores.Application.Interfaces;

public interface IProductService
{
    Task<CreateProductResult> CreateProductAsync(CreateProductDto request, CancellationToken cancellationToken = default);
    Task<GetProductDetailResult> GetProductByIdAsync(int productId, CancellationToken cancellationToken = default);
    Task<UpdateProductResult> UpdateProductAsync(UpdateProductDto request, CancellationToken cancellationToken = default);
    Task<UpdateProductStatusResult> UpdateProductStatusAsync(UpdateProductStatusDto request, CancellationToken cancellationToken = default);
    //Task<GetProductsResult> GetProductsAsync(GetProductsQuery request, CancellationToken cancellationToken = default);
}
