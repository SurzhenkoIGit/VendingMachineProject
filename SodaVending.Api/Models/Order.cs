namespace SodaVending.Api.Models;

//Сущность "Заказ"
public class Order
{
    public int Id { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal PaymentAmount { get; set; }
    public decimal ChangeAmount { get; set; }
    public string? ChangeCoins { get; set; }
    public string? PaymentCoins { get; set; }
    
    // Связь с сущностью OrderItems "один ко многим"
    public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
