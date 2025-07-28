using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using SodaVending.Api.DTOs;
using SodaVending.Api.Services;

namespace SodaVending.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost("validate")]
    public async Task<ActionResult<PaymentValidationResultDto>> ValidatePayment([FromBody] ValidatePaymentDto dto)
    {
        //var result = await _paymentService.ValidatePaymentAsync(dto.TotalAmount, dto.PaymentCoins);

        //return Ok(result);
        var (isSuccess, errorMessage) = await _paymentService.CheckPaymentPossibilityAsync(dto.TotalAmount, dto.PaymentCoins);
        if (!isSuccess)
        {
            return BadRequest(new { ErrorMessage = errorMessage });
        }
        var change = await _paymentService.ProcessPaymentAndUpdateCoinsAsync(dto.TotalAmount, dto.PaymentCoins);
        return Ok(new { Change = change });
    }

}


