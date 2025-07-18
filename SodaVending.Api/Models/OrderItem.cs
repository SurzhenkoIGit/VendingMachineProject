namespace SodaVending.Api.Models;

//�������� "������ ������"
public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string BrandName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public int TotalPrice { get; set; }
    
    public Order Order { get; set; } = null!;
}
