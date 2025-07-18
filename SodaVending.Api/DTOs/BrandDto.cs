namespace SodaVending.Api.DTOs;

//Объект передачи данных для сущности "Бренды"
public class BrandDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class CreateBrandDto 
{
    public string Name { get; set; } = string.Empty;
}

public class UpdateBrandDto
{
    public string Name { get; set; } = string.Empty;
}
