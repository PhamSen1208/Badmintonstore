using BadmintonStores.Application.DTOs.Orders;

namespace BadmintonStores.Application.Interfaces;

public interface IOrderService
{
    Task<CreateOrderResult> CreateOrderAsync(CreateOrderDto request, CancellationToken cancellationToken = default);
    Task<GetOrderDetailResult> GetOrderByIdAsync(int orderId, CancellationToken cancellationToken = default);
    Task<GetOrdersResult> GetOrdersAsync(GetOrdersQuery query, CancellationToken cancellationToken = default);
    Task<CancelOrderResult> CancelOrderResultAsync(int orderId, CancellationToken cancellationToken = default); 
    Task<UpdateOrderNoteResult> UpdateOrderNoteAsync(UpdateOrderNoteDto request, CancellationToken cancellationToken = default);

}