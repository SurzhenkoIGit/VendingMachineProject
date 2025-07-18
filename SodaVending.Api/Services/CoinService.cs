using SodaVending.Api.DTOs;
using SodaVending.Api.Models;
using SodaVending.Api.Repositories;

namespace SodaVending.Api.Services;

//Сервис бизнес-логики для контроллера "Coins"
public class CoinService : ICoinService
{
    private readonly ICoinRepository _coinRepository;

    public CoinService(ICoinRepository coinRepository)
    {
        _coinRepository = coinRepository;
    }

    public async Task<IEnumerable<CoinDto>> GetAllCoinsAsync()
    {
        var coins = await _coinRepository.GetAllOrderedByNominalAsync();

        return coins.Select(MapToDto);
    }

    public async Task<CoinDto?> GetCoinByNominalAsync(int nominal)
    {
        var coin = await _coinRepository.GetByNominalAsync(nominal);

        return coin == null ? null : MapToDto(coin);
    }

    public async Task<CoinDto?> UpdateCoinQuantityAsync(int nominal, UpdateCoinQuantityDto updateDto)
    {
        var coin = await _coinRepository.GetByNominalAsync(nominal);
        if (coin == null)
            return null;

        coin.Quantity = updateDto.Quantity;
        
        await _coinRepository.UpdateAsync(coin);

        return MapToDto(coin);
    }

    private static CoinDto MapToDto(Coin coin)
    {
        return new CoinDto
        {
            Id = coin.Id,
            Denomination = coin.Nominal,
            Quantity = coin.Quantity
        };
    }
}
