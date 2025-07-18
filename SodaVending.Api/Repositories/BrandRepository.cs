using Microsoft.EntityFrameworkCore;
using SodaVending.Api.Data;
using SodaVending.Api.Models;

namespace SodaVending.Api.Repositories;

public class BrandRepository : BaseRepository<Brand>, IBrandRepository
{
    public BrandRepository(SodaVendingDbContext context) : base(context)
    {
    }

    //Доп. метод получения бренда по названию бренда
    public async Task<Brand?> GetByNameAsync(string name)
    {
        return await _context.Brands
            .FirstOrDefaultAsync(b => b.Name.ToLower() == name.ToLower());
    }
}
