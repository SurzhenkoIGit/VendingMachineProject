using SodaVending.Api.DTOs;

namespace SodaVending.Api.Services;

public interface IPaymentService
{
    Task<PaymentValidationResultDto> ValidatePaymentAsync(int totalAmount, Dictionary<int, int> paymentCoins);
    Dictionary<int, int> CalculateChange(int changeAmount, Dictionary<int, int> availableCoins);
}
