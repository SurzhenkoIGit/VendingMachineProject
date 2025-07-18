namespace SodaVending.Api.DTOs;

//Объект передачи данных для сущности "Монеты"
public class CoinDto
{
    public int Id { get; set; }
    public int Denomination { get; set; }
    public int Quantity { get; set; }
}

public class UpdateCoinQuantityDto
{
    public int Quantity { get; set; }
}
