namespace SodaVending.Api.DTOs;

//������ �������� ������ ��� ���������� �������� �� ������
public class ProductFilterDto
{
    public int? BrandId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
}

//DTO ��� ���������� �� ��������� �� ����������� �� ������������ ����
public class PriceRangeDto
{
    public decimal MinPrice { get; set; }
    public decimal MaxPrice { get; set; }
}
