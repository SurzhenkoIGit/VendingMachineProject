namespace SodaVending.Api.Models;

//Сущность "Товары"
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Price { get; set; }
    public int Quantity { get; set; }
    public int BrandId { get; set; }
    public string? ImageUrl { get; set; }
    
    public Brand Brand { get; set; } = null!;
}
