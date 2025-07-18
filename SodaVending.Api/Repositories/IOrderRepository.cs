using SodaVending.Api.Models;

namespace SodaVending.Api.Repositories;

public interface IOrderRepository : IBaseRepository<Order>
{
    Task<IEnumerable<Order>> GetAllWithItemsAsync();
    Task<Order?> GetByIdWithItemsAsync(int id);
}
