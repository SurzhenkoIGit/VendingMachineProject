namespace SodaVending.Api.DTOs;

//������ �������� ������ ��� �������� "������"
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
