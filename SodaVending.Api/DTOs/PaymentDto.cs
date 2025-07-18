namespace SodaVending.Api.DTOs;

public class PaymentValidationResultDto
{
    public bool CanMakeChange { get; set; }
    public string? ErrorMessage { get; set; }
    public Dictionary<int, int>? ChangeCoins { get; set; }
    public int ChangeAmount { get; set; }
}

public class ValidatePaymentDto
{
    public int TotalAmount { get; set; }
    public Dictionary<int, int> PaymentCoins { get; set; } = new();
}