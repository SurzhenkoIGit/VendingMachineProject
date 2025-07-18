namespace SodaVending.Api.Models;

//�������� "������"
public class Brand
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    
    // ����� � ��������� Product "���� �� ������"
    public List<Product> Products { get; set; } = new List<Product>();
}
