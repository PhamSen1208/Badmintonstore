using BadmintonStores.Api.Responses;
using BadmintonStores.Application.DTOs.InventoryTransactions;
using BadmintonStores.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using BadmintonStores.Application.Common.Security;
using Microsoft.AspNetCore.Authorization;


namespace BadmintonStores.Api.Controllers;

[Authorize(Roles = RoleNames.AdminOrStaff)]
[ApiController]
[Route("api/inventory-transactions")]
public class InventoryTransactionsController : ControllerBase
{
    private readonly IInventoryTransactionService _transactionService;

    public InventoryTransactionsController(IInventoryTransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetTransactions(
        [FromQuery] GetInventoryTransactionsQuery query, 
        CancellationToken cancellationToken)
    {
        var result = await _transactionService.GetTransactionsAsync(query, cancellationToken);
        return Ok(ApiResponse<GetInventoryTransactionsResult>.Ok(result, "Lấy nhật ký tồn kho thành công"));
    }
}
