using Microsoft.EntityFrameworkCore;
using SodaVending.Api.Data;
using SodaVending.Api.Models;

namespace SodaVending.Api.Repositories;

public class OrderRepository : BaseRepository<Order>, IOrderRepository
{
    public OrderRepository(SodaVendingDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Order>> GetAllWithItemsAsync()
    {
        return await _context.Orders
            .Include(o => o.OrderItems)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();
    }

    public async Task<Order?> GetByIdWithItemsAsync(int id)
    {
        return await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == id);
    }
}
