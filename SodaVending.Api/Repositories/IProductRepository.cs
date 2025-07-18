using SodaVending.Api.Models;

namespace SodaVending.Api.Repositories;

public interface IProductRepository : IBaseRepository<Product>
{
    Task<IEnumerable<Product>> GetProductsByBrandAsync(int brandId);
    Task<IEnumerable<Product>> GetProductsByPriceRangeAsync(decimal minPrice, decimal maxPrice);
    Task<IEnumerable<Product>> GetFilteredProductsAsync(int? brandId, decimal? minPrice, decimal? maxPrice);
    Task<(decimal min, decimal max)> GetPriceRangeAsync(int? brandId = null);
}
