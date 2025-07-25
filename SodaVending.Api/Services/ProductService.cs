using SodaVending.Api.DTOs;
using SodaVending.Api.Models;
using SodaVending.Api.Repositories;

namespace SodaVending.Api.Services;

//Сервис бизнес-логики для контроллера "Products"
public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IBrandRepository _brandRepository;

    public ProductService(IProductRepository productRepository, IBrandRepository brandRepository)
    {
        _productRepository = productRepository;
        _brandRepository = brandRepository;
    }

    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        var products = await _productRepository.GetAllAsync();

        return products.Select(MapToDto);
    }

    public async Task<ProductDto?> GetProductByIdAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);

        return product == null ? null : MapToDto(product);
    }

    public async Task<IEnumerable<ProductDto>> GetFilteredProductsAsync(ProductFilterDto filter)
    {
        var products = await _productRepository.GetFilteredProductsAsync(
            filter.BrandId, 
            filter.MinPrice, 
            filter.MaxPrice
        );

        return products.Select(MapToDto);
    }

    public async Task<PriceRangeDto> GetPriceRangeAsync(int? brandId = null)
    {
        var (min, max) = await _productRepository.GetPriceRangeAsync(brandId);

        return new PriceRangeDto
        {
            MinPrice = min,
            MaxPrice = max
        };
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto)
    {
        var brand = await _brandRepository.GetByIdAsync(createProductDto.BrandId);
        if (brand == null)
            throw new ArgumentException($"Brand not found");

        var product = new Product
        {
            Name = createProductDto.Name,
            Price = createProductDto.Price,
            Quantity = createProductDto.Quantity,
            BrandId = createProductDto.BrandId,
            ImageUrl = createProductDto.ImageUrl,
        };

        var createdProduct = await _productRepository.AddAsync(product);
        createdProduct.Brand = brand;

        return MapToDto(createdProduct);
    }
    public async Task<ProductDto?> UpdateProductAsync(int id, UpdateProductDto updateProductDto)
    {
        var product = await _productRepository.GetByIdAsync(id);
        product.Name = updateProductDto.Name;
        product.Price = updateProductDto.Price;
        product.Quantity = updateProductDto.Quantity;
        product.BrandId = updateProductDto.BrandId;
        product.ImageUrl = updateProductDto.ImageUrl;

        await _productRepository.UpdateAsync(product);

        return MapToDto(product);
    }

    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product == null)
            return false;

        await _productRepository.DeleteAsync(id);

        return true;
    }

    private static ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            Quantity = product.Quantity,
            BrandId = product.BrandId,
            BrandName = product.Brand?.Name ?? string.Empty,
            ImageUrl = $"http://localhost:5000/images/products/{product.ImageUrl}"
        };
    }
}
