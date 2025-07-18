namespace SodaVending.Api.DTOs;

//Объект передачи данных для сущности "Заказ"
public class OrderDto
{
    public int Id { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal PaymentAmount { get; set; }
    public decimal ChangeAmount { get; set; }
    public Dictionary<int, int>? ChangeCoins { get; set; }
    public List<OrderItemDto> OrderItems { get; set; } = new();
    public Dictionary<int, int>? PaymentCoins { get; set; }
}

public class OrderItemDto
{
    public int Id { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string BrandName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice { get; set; }
}

public class CreateOrderDto
{
    public List<CreateOrderItemDto> OrderItems { get; set; } = new();
    public Dictionary<int, int> PaymentCoins { get; set; } = new();
}

public class CreateOrderItemDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}
