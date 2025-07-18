using SodaVending.Api.DTOs;

namespace SodaVending.Api.Services;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllProductsAsync();
    Task<ProductDto?> GetProductByIdAsync(int id);
    Task<IEnumerable<ProductDto>> GetFilteredProductsAsync(ProductFilterDto filter);
    Task<PriceRangeDto> GetPriceRangeAsync(int? brandId = null);
    Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto);
    Task<ProductDto?> UpdateProductAsync(int id, UpdateProductDto updateProductDto);
    Task<bool> DeleteProductAsync(int id);
}
