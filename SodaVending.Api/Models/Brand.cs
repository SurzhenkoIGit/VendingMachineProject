namespace SodaVending.Api.Models;

//Сущность "Бренды"
public class Brand
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    
    // Связь с сущностью Product "один ко многим"
    public List<Product> Products { get; set; } = new List<Product>();
}
