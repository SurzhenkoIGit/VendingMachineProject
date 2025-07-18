using Microsoft.AspNetCore.Mvc;
using SodaVending.Api.DTOs;
using SodaVending.Api.Services;

namespace SodaVending.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BrandsController : ControllerBase
{
    private readonly IBrandService _brandService;

    public BrandsController(IBrandService brandService)
    {
        _brandService = brandService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BrandDto>>> GetBrands()
    {
        var brands = await _brandService.GetAllBrandsAsync();

        return Ok(brands);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BrandDto>> GetBrand(int id)
    {
        var brand = await _brandService.GetBrandByIdAsync(id);

        if (brand == null)
            return NotFound();

        return Ok(brand);
    }

    [HttpPost]
    public async Task<ActionResult<BrandDto>> CreateBrand(CreateBrandDto createBrandDto)
    {
        try
        {
            var brand = await _brandService.CreateBrandAsync(createBrandDto);
            return CreatedAtAction(nameof(GetBrand), new { id = brand.Id }, brand);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBrand(int id, UpdateBrandDto updateBrandDto)
    {
        try
        {
            var brand = await _brandService.UpdateBrandAsync(id, updateBrandDto);

            if (brand == null)
                return NotFound();

            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBrand(int id)
    {
        var result = await _brandService.DeleteBrandAsync(id);

        if (!result)
            return NotFound();

        return NoContent();
    }
}
