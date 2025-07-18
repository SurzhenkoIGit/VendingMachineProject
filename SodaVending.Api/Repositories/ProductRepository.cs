using Microsoft.EntityFrameworkCore;
using SodaVending.Api.Data;
using SodaVending.Api.Models;

namespace SodaVending.Api.Repositories;

public class ProductRepository : BaseRepository<Product>, IProductRepository
{
    public ProductRepository(SodaVendingDbContext context) : base(context)
    {
    }

    public override async Task<IEnumerable<Product>> GetAllAsync()
    {
        return await _context.Products
            .Include(p => p.Brand)
            .ToListAsync();
    }

    public override async Task<Product?> GetByIdAsync(int id)
    {
        return await _context.Products
            .Include(p => p.Brand)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Product>> GetProductsByBrandAsync(int brandId)
    {
        return await _context.Products
            .Include(p => p.Brand)
            .Where(p => p.BrandId == brandId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetProductsByPriceRangeAsync(decimal minPrice, decimal maxPrice)
    {
        return await _context.Products
            .Include(p => p.Brand)
            .Where(p => p.Price >= minPrice && p.Price <= maxPrice)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetFilteredProductsAsync(int? brandId, decimal? minPrice, decimal? maxPrice)
    {
        var query = _context.Products.Include(p => p.Brand).AsQueryable();

        if (brandId.HasValue)
        {
            query = query.Where(p => p.BrandId == brandId.Value);
        }

        if (minPrice.HasValue)
        {
            query = query.Where(p => p.Price >= minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= maxPrice.Value);
        }

        return await query.ToListAsync();
    }

    public async Task<(decimal min, decimal max)> GetPriceRangeAsync(int? brandId = null)
    {
        var query = _context.Products.AsQueryable();

        if (brandId.HasValue)
        {
            query = query.Where(p => p.BrandId == brandId.Value);
        }

        var prices = await query.Select(p => p.Price).ToListAsync();
        
        if (!prices.Any())
        {
            return (0, 0);
        }

        return (prices.Min(), prices.Max());
    }
}
