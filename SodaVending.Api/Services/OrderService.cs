using System.Text.Json;
using SodaVending.Api.DTOs;
using SodaVending.Api.Models;
using SodaVending.Api.Repositories;

namespace SodaVending.Api.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;
    private readonly ICoinRepository _coinRepository;
    private readonly IPaymentService _paymentService;

    public OrderService(
        IOrderRepository orderRepository, 
        IProductRepository productRepository,
        ICoinRepository coinRepository,
        IPaymentService paymentService)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
        _coinRepository = coinRepository;
        _paymentService = paymentService;
    }

    
    //Метод для создания заказа с полным циклом обработки: проверка наличия товаров, проверка платежа, расчет сдачи, обновление количества товара и сдачи в БД
    public async Task<OrderDto> CreateOrderAsync(CreateOrderDto createOrderDto)
    {
        int totalAmount = 0;
        var orderItems = new List<OrderItem>();
        
        // Проходим по каждому товару в корзине клиента
        foreach (var item in createOrderDto.OrderItems)
        {
            var product = await _productRepository.GetByIdAsync(item.ProductId);
            if (product == null)
                throw new ArgumentException($"Product with ID {item.ProductId} not found");

            // Проверяем, достаточно ли товара на складе
            if (product.Quantity < item.Quantity)
                throw new ArgumentException($"Not enough quantity for product {product.Name}");

            var orderItem = new OrderItem
            {
                ProductName = product.Name,
                BrandName = product.Brand?.Name ?? string.Empty,
                Price = product.Price,
                Quantity = item.Quantity,
                TotalPrice = product.Price * item.Quantity
            };

            orderItems.Add(orderItem);

            // Суммируем общую стоимость заказа
            totalAmount += orderItem.TotalPrice;
        }

        var (isSuccess, errorMessage) = await _paymentService.CheckPaymentPossibilityAsync(totalAmount, createOrderDto.PaymentCoins);
        if (!isSuccess) 
            throw new InvalidOperationException(errorMessage);

        var changeCoins = await _paymentService.ProcessPaymentAndUpdateCoinsAsync(totalAmount, createOrderDto.PaymentCoins);
        var changeAmount = changeCoins.Sum(c => c.Key * c.Value);
        // Рассчитываем общую сумму, внесенную клиентом.
        decimal paymentAmount = createOrderDto.PaymentCoins.Sum(c => c.Key * c.Value);

        var order = new Order 
        { 
            OrderDate = DateTime.UtcNow,
            TotalAmount = totalAmount,
            PaymentAmount = paymentAmount,
            OrderItems = orderItems, 
            ChangeAmount = changeAmount,
            ChangeCoins = JsonSerializer.Serialize(changeCoins) , // Используем Serialize для хранения пары ключ-значение в качетсве JSON строки
            PaymentCoins = JsonSerializer.Serialize(createOrderDto.PaymentCoins)
        };
        
        // Сохраняем заказ и его позиции в БД
        var createdOrder = await _orderRepository.AddAsync(order);

        // После успешного создания заказа уменьшаем количество купленных товаров на складе
        foreach (var item in createOrderDto.OrderItems)
        {
            var product = await _productRepository.GetByIdAsync(item.ProductId);
            if (product != null)
            {
                product.Quantity -= item.Quantity;
                await _productRepository.UpdateAsync(product);
            }
        }
        
        return MapToDto(createdOrder);
    }

    public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
    {
        var orders = await _orderRepository.GetAllWithItemsAsync();
        return orders.Select(MapToDto);
    }

    public async Task<OrderDto?> GetOrderByIdAsync(int id)
    {
        var order = await _orderRepository.GetByIdWithItemsAsync(id);
        return order == null ? null : MapToDto(order);
    }

    private static OrderDto MapToDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            OrderDate = order.OrderDate,
            TotalAmount = order.TotalAmount,
            PaymentAmount = order.PaymentAmount,
            ChangeAmount = order.ChangeAmount,
            ChangeCoins = string.IsNullOrEmpty(order.ChangeCoins) 
                ? null 
                : JsonSerializer.Deserialize<Dictionary<int, int>>(order.ChangeCoins),
            OrderItems = order.OrderItems.Select(MapItemToDto).ToList(),
            PaymentCoins = order.PaymentCoins != null ? JsonSerializer.Deserialize<Dictionary<int, int>>(order.PaymentCoins) : null
        };
    }

    private static OrderItemDto MapItemToDto(OrderItem item)
    {
        return new OrderItemDto
        {
            Id = item.Id,
            ProductName = item.ProductName,
            BrandName = item.BrandName,
            Price = item.Price,
            Quantity = item.Quantity,
            TotalPrice = item.TotalPrice
        };
    }
}
