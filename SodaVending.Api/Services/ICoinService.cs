using SodaVending.Api.DTOs;

namespace SodaVending.Api.Services;

public interface ICoinService
{
    Task<IEnumerable<CoinDto>> GetAllCoinsAsync();
    Task<CoinDto?> GetCoinByNominalAsync(int denomination);
    Task<CoinDto?> UpdateCoinQuantityAsync(int denomination, UpdateCoinQuantityDto updateDto);
}
