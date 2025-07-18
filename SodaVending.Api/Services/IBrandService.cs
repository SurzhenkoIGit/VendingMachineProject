using SodaVending.Api.DTOs;

namespace SodaVending.Api.Services;

public interface IBrandService
{
    Task<IEnumerable<BrandDto>> GetAllBrandsAsync();
    Task<BrandDto?> GetBrandByIdAsync(int id);
    Task<BrandDto> CreateBrandAsync(CreateBrandDto createBrandDto);
    Task<BrandDto?> UpdateBrandAsync(int id, UpdateBrandDto updateBrandDto);
    Task<bool> DeleteBrandAsync(int id);
}
