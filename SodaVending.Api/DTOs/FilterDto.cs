namespace SodaVending.Api.DTOs;

//Объект передачи данных для фильтрации значений по бренду
public class ProductFilterDto
{
    public int? BrandId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
}

//DTO для фильтрации по диапазону от минимальной до максимальной цены
public class PriceRangeDto
{
    public decimal MinPrice { get; set; }
    public decimal MaxPrice { get; set; }
}
