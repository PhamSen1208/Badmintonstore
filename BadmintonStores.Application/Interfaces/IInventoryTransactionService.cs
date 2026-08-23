using BadmintonStores.Application.DTOs.InventoryTransactions;

namespace BadmintonStores.Application.Interfaces;

public interface IInventoryTransactionService
{
    Task<GetInventoryTransactionsResult> GetTransactionsAsync(GetInventoryTransactionsQuery request, CancellationToken cancellationToken = default);
}