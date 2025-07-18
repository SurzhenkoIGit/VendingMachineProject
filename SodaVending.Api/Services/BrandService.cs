using SodaVending.Api.DTOs;
using SodaVending.Api.Models;
using SodaVending.Api.Repositories;

namespace SodaVending.Api.Services;

//Сервис бизнес-логики для контроллера "Brands"
public class BrandService : IBrandService
{
    private readonly IBrandRepository _brandRepository;

    public BrandService(IBrandRepository brandRepository)
    {
        _brandRepository = brandRepository;
    }

    public async Task<IEnumerable<BrandDto>> GetAllBrandsAsync()
    {
        var brands = await _brandRepository.GetAllAsync();

        return brands.Select(MapToDto);
    }

    public async Task<BrandDto?> GetBrandByIdAsync(int id)
    {
        var brand = await _brandRepository.GetByIdAsync(id);

        return brand == null ? null : MapToDto(brand);
    }

    public async Task<BrandDto> CreateBrandAsync(CreateBrandDto createBrandDto)
    {
        var existingBrand = await _brandRepository.GetByNameAsync(createBrandDto.Name);
        if (existingBrand != null)
            throw new ArgumentException($"Brand with name '{createBrandDto.Name}' already exists");

        var brand = new Brand
        {
            Name = createBrandDto.Name,
        };

        var createdBrand = await _brandRepository.AddAsync(brand);

        return MapToDto(createdBrand);
    }

    public async Task<BrandDto?> UpdateBrandAsync(int id, UpdateBrandDto updateBrandDto)
    {
        var brand = await _brandRepository.GetByIdAsync(id);
        if (brand == null)
            return null;

        var existingBrand = await _brandRepository.GetByNameAsync(updateBrandDto.Name);
        if (existingBrand != null && existingBrand.Id != id)
            throw new ArgumentException($"Brand with name '{updateBrandDto.Name}' already exists");

        brand.Name = updateBrandDto.Name;

        await _brandRepository.UpdateAsync(brand);

        return MapToDto(brand);
    }

    public async Task<bool> DeleteBrandAsync(int id)
    {
        var brand = await _brandRepository.GetByIdAsync(id);
        if (brand == null)
            return false;

        await _brandRepository.DeleteAsync(id);

        return true;
    }

    private static BrandDto MapToDto(Brand brand)
    {
        return new BrandDto
        {
            Id = brand.Id,
            Name = brand.Name
        };
    }
}
