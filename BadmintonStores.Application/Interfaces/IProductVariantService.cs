using BadmintonStores.Application.DTOs.ProductVariants;

namespace BadmintonStores.Application.Interfaces;

public interface IProductVariantService
{
    Task<CreateProductVariantResult> CreateProductVariantAsync(CreateProductVariantDto request, CancellationToken cancellationToken = default);
    Task<GetProductVariantDetailResult> GetProductVariantByIdAsync(int productVariantId, CancellationToken cancellationToken = default);
    Task<GetProductVariantsResult> GetProductVariantsAsync(GetProductVariantsQuery request, CancellationToken cancellationToken= default);
    Task<UpdateProductVariantResult> UpdateProductVariantAsync(UpdateProductVariantDto request, CancellationToken cancellationToken = default);
    Task<UpdateProductVariantStatusResult> UpdateProductVariantStatusAsync(UpdateProductVariantStatusDto request, CancellationToken cancellationToken = default);
}