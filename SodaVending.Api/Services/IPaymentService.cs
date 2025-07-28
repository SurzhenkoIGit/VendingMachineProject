using SodaVending.Api.DTOs;

namespace SodaVending.Api.Services;

public interface IPaymentService
{
    Task<(bool isSuccess, string ErrorMessage)> CheckPaymentPossibilityAsync(int totalAmount, Dictionary<int, int> paymentCoins);
    Task<Dictionary<int, int>> ProcessPaymentAndUpdateCoinsAsync(int totalAmount, Dictionary<int, int> paymentCoins);
    //Task<PaymentValidationResultDto> ValidatePaymentAsync(int totalAmount, Dictionary<int, int> paymentCoins);
}
