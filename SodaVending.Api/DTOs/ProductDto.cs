namespace SodaVending.Api.DTOs;

//Объект передачи данных для сущности "Товары"
public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Price { get; set; }
    public int Quantity { get; set; }
    public int BrandId { get; set; }
    public string BrandName { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
}

public class CreateProductDto
{
    public string Name { get; set; } = string.Empty;
    public int Price { get; set; }
    public int Quantity { get; set; }
    public int BrandId { get; set; }
    public string? ImageUrl { get; set; }
}

public class UpdateProductDto
{
    public string Name { get; set; } = string.Empty;
    public int Price { get; set; }
    public int Quantity { get; set; }
    public int BrandId { get; set; }
    public string? ImageUrl { get; set; }
}
