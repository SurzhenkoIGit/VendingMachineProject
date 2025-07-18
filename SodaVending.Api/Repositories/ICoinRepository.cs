using SodaVending.Api.Models;

namespace SodaVending.Api.Repositories;

public interface ICoinRepository : IBaseRepository<Coin>
{
    Task<Coin?> GetByNominalAsync(int denomination);
    Task<IEnumerable<Coin>> GetAllOrderedByNominalAsync();
    Task UpdateQuantitiesAsync(Dictionary<int, int> updates);
}
