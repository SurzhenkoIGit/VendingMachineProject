using Microsoft.EntityFrameworkCore;
using SodaVending.Api.Data;
using SodaVending.Api.Models;

namespace SodaVending.Api.Repositories;

public class CoinRepository : BaseRepository<Coin>, ICoinRepository
{
    public CoinRepository(SodaVendingDbContext context) : base(context)
    {
    }

    //��������� ������ �� ��������
    public async Task<Coin?> GetByNominalAsync(int denomination)
    {
        return await _context.Coins
            .FirstOrDefaultAsync(c => c.Nominal == denomination);
    }

    //��������� ��������������� �� �������� �����
    public async Task<IEnumerable<Coin>> GetAllOrderedByNominalAsync()
    {
        return await _context.Coins
            .OrderBy(c => c.Nominal)
            .ToListAsync();
    }

    //���������� ���������� ����� � ��
    public async Task UpdateQuantitiesAsync(Dictionary<int, int> updates)
    {
        foreach (var update in updates)
        {
            var coin = await GetByNominalAsync(update.Key);
            if (coin != null)
                coin.Quantity += update.Value;
        }
        
        await _context.SaveChangesAsync();
    }
}
