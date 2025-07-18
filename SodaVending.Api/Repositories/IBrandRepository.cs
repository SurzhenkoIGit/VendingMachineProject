using SodaVending.Api.Models;

namespace SodaVending.Api.Repositories;

public interface IBrandRepository : IBaseRepository<Brand>
{
    Task<Brand?> GetByNameAsync(string name);
}
