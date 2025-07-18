namespace SodaVending.Api.Models;

//Сущность "Монеты"
public class Coin
{
    public int Id { get; set; }
    public int Nominal { get; set; } // Номинал монеты (1, 2, 5, 10)
    public int Quantity { get; set; }
}
