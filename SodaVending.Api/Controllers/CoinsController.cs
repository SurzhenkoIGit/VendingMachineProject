using Microsoft.AspNetCore.Mvc;
using SodaVending.Api.DTOs;
using SodaVending.Api.Services;

namespace SodaVending.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoinsController : ControllerBase
{
    private readonly ICoinService _coinService;

    public CoinsController(ICoinService coinService)
    {
        _coinService = coinService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CoinDto>>> GetCoins()
    {
        var coins = await _coinService.GetAllCoinsAsync();

        return Ok(coins);
    }

    [HttpGet("{denomination}")]
    public async Task<ActionResult<CoinDto>> GetCoin(int denomination)
    {
        var coin = await _coinService.GetCoinByNominalAsync(denomination);
        if (coin == null)
            return NotFound();

        return Ok(coin);
    }

    [HttpPut("{denomination}")]
    public async Task<IActionResult> UpdateCoinQuantity(int denomination, UpdateCoinQuantityDto updateDto)
    {
        var coin = await _coinService.UpdateCoinQuantityAsync(denomination, updateDto);
        if (coin == null)
            return NotFound();

        return NoContent();
    }
}
