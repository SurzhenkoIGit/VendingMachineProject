using SodaVending.Api.DTOs;
using SodaVending.Api.Repositories;

namespace SodaVending.Api.Services;

public class PaymentService : IPaymentService
{
    private readonly ICoinRepository _coinRepository;

    public PaymentService(ICoinRepository coinRepository)
    {
        _coinRepository = coinRepository;
    }

    //Метод для проверки возможности выдачи сдачи
    public async Task<(bool isSuccess, string ErrorMessage)> CheckPaymentPossibilityAsync(int totalAmount, Dictionary<int, int> paymentCoins)
    {
        int paymentAmount = paymentCoins.Sum(c => c.Key * c.Value);

        if (paymentAmount < totalAmount)
            return (false, "Недостаточно средаст для оплаты");

        int changeAmount = paymentAmount - totalAmount;
        if (changeAmount == 0)
            return (true, string.Empty);

        var coinsInVending = await _coinRepository.GetAllAsync();
        var availableCoins = new Dictionary<int, int>();
        foreach (var coin in coinsInVending)
        {
            availableCoins[coin.Nominal] = coin.Quantity + (paymentCoins.ContainsKey(coin.Nominal) ? paymentCoins[coin.Nominal] : 0);
        }

        var changeCoins = CalculateChange(changeAmount, availableCoins);

        if (changeAmount == null)
            return (false, "Автомат не может выдать необходимую сумму!");

        return (true, string.Empty);
    }

    //Метод для выдачи сдачи
    public async Task<Dictionary<int, int>> ProcessPaymentAndUpdateCoinsAsync(int totalAmount, Dictionary<int, int> paymentCoins)
    {
        int paymentAmount = paymentCoins.Sum(c => c.Key * c.Value);
        int changeAmount = paymentAmount - totalAmount;

        var coinsInMachine = await _coinRepository.GetAllAsync();
        var availableCoinsForChange = new Dictionary<int, int>();
        var finalCoinQuantities = new Dictionary<int, int>(); 

        foreach (var coin in coinsInMachine)
        {
            var totalQuantity = coin.Quantity + (paymentCoins.ContainsKey(coin.Nominal) ? paymentCoins[coin.Nominal] : 0);
            availableCoinsForChange[coin.Nominal] = totalQuantity;
            finalCoinQuantities[coin.Nominal] = totalQuantity;
        }

        var changeToReturn = CalculateChange(changeAmount, availableCoinsForChange);
        if (changeToReturn == null)
        {
            throw new InvalidOperationException("Не удалось рассчитать сдачу после успешной валидации.");
        }

        foreach (var changeCoin in changeToReturn)
        {
            finalCoinQuantities[changeCoin.Key] -= changeCoin.Value;
        }

        await _coinRepository.UpdateQuantitiesAsync(finalCoinQuantities);

        return changeToReturn;
    }

    //Старый метод для проверки, достаточно ли средств для платежа, может ли автомат выдать сдачу
    //public async Task<PaymentValidationResultDto> ValidatePaymentAsync(int totalAmount, Dictionary<int, int> paymentCoins)
    //{
    //    // Рассчитываем общую сумму, внесенную пользователем.
    //    int paymentAmount = 0;
    //    foreach (var coin in paymentCoins)
    //    {
    //        paymentAmount += coin.Key * coin.Value;
    //    }

    //    // Проверка, достаточно ли денег для оплаты.
    //    if (paymentAmount < totalAmount)
    //    {
    //        return new PaymentValidationResultDto
    //        {
    //            CanMakeChange = false,
    //            ErrorMessage = "Недостаточно средств"
    //        };
    //    }
        
    //    // Рассчитываем сумму сдачи.
    //    int changeAmount = paymentAmount - totalAmount;
        
    //    // Если сдача не требуется, возвращаем успешный платеж.
    //    if (changeAmount == 0)
    //    {
    //        return new PaymentValidationResultDto
    //        {
    //            CanMakeChange = true,
    //            ChangeAmount = 0,
    //            ChangeCoins = new Dictionary<int, int>()
    //        };
    //    }

    //    // Получаем все номиналы монет, имеющиеся в автомате, отсортированные для алгоритма расчета сдачи.
    //    var coins = await _coinRepository.GetAllOrderedByNominalAsync();

    //    // Создаем словарь, который будет содержать ВСЕ доступные монеты для выдачи сдачи: те, что уже были в автомате + те, что только что внес пользователь.
    //    var availableCoins = new Dictionary<int, int>();
        
    //    foreach (var coin in coins)
    //    {
    //        // Суммируем монеты в автомате и монеты, внесенные пользователем.
    //        var totalQuantity = coin.Quantity + (paymentCoins.ContainsKey(coin.Nominal) ? paymentCoins[coin.Nominal] : 0);
    //        availableCoins[coin.Nominal] = totalQuantity;
    //    }

    //    // Вызываем алгоритм для расчета сдачи.
    //    var changeCoins = CalculateChange(changeAmount, availableCoins);
        
    //    // Если алгоритм вернул null, значит, собрать нужную сумму сдачи из имеющихся монет невозможно.
    //    if (changeCoins == null)
    //    {
    //        return new PaymentValidationResultDto
    //        {
    //            CanMakeChange = false,
    //            ErrorMessage = "Извините, автомат не может выдать вам нужную сдачу",
    //            ChangeAmount = changeAmount
    //        };
    //    }

    //    // Если сдача успешно рассчитана, возвращаем положительный результат.
    //    return new PaymentValidationResultDto
    //    {
    //        CanMakeChange = true,
    //        ChangeCoins = changeCoins,
    //        ChangeAmount = changeAmount
    //    };
    //}

    // Метод расчета сдачи "автоматом"
    private Dictionary<int, int> CalculateChange(int changeAmount, Dictionary<int, int> availableCoins) // Используем словарь в связке ключ-значение (ключ - номинал монеты, значение - количество)
    {
        var changeToCalculate = changeAmount;
        
        // Получаем список номиналов и сортируем его по убыванию. Суть сортировки: сначала выдаем крупными монетами, потом мелкими
        var nominals = availableCoins.Keys.OrderByDescending(d => d).ToList();
        var result = new Dictionary<int, int>();
        var tempAvailable = new Dictionary<int, int>(availableCoins);

        foreach (var nominal in nominals)
        {
            // Определяем, сколько монет текущего номинала можно поместить в оставшуюся сумму сдачи.
            var coinsNeeded = changeToCalculate / nominal;
            var coinsAvailableForNominal = tempAvailable[nominal];
            
            if (coinsNeeded > 0 && coinsAvailableForNominal > 0)
            {
                var coinsToUse = Math.Min(coinsNeeded, coinsAvailableForNominal);
                
                // Добавляем использованные монеты в результат.
                result[nominal] = coinsToUse;
                
                // Уменьшаем количество доступных монет этого номинала.
                tempAvailable[nominal] -= coinsToUse;
                
                // Уменьшаем оставшуюся сумму сдачи.
                changeToCalculate -= coinsToUse * nominal;
            }
        }
        
        if(changeToCalculate != 0)
            return null!;

        return result;
    }

    
}
