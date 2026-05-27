using BadmintonStores.Api.Requests.Orders;
using BadmintonStores.Api.Responses.Orders;
using BadmintonStores.Api.Responses;
using BadmintonStores.Application.DTOs.Orders;
using BadmintonStores.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BadmintonStores.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request, CancellationToken cancellationToken)
    {
        // Map CreateOrderRequest sang CreateOrderDto
        var dto = new CreateOrderDto
        {
            CustomerId = request.CustomerId,
            WarehouseId = request.WarehouseId,
            Note = request.Note,
            Items = request.Items.Select(i => new CreateOrderItemDto
            {
                ProductVariantId = i.ProductVariantId,
                Quantity = i.Quantity
            }).ToList(),
            Payment = request.Payment == null ? null : new CreatePaymentDto
            {
                PaymentMethod = request.Payment.PaymentMethod
            }
        };  

        // Gọi service để tạo đơn hàng
        var result = await _orderService.CreateOrderAsync(dto, cancellationToken);
        // Map CreateOrderResult sang CreateOrderResponse
        var response = new CreateOrderResponse
        {
            OrderId = result.OrderId,
            OrderCode = result.OrderCode,
            Status = result.Status,
            PaymentStatus = result.PaymentStatus,
            Subtotal = result.Subtotal,
            DiscountAmount = result.DiscountAmount,
            TotalAmount = result.TotalAmount,
            Items = result.Items.Select(i => new CreateOrderItemResponse
            {
                ProductVariantId = i.ProductVariantId,
                SKU = i.SKU,
                ProductName = i.ProductName,
                UnitPrice = i.UnitPrice,
                Quantity = i.Quantity,
                LineTotal = i.LineTotal
            }).ToList(),
            Payment = result.Payment == null ? null : new CreateOrderPaymentResponse 
            {
                PaymentMethod = result.Payment.PaymentMethod,
                PaymentStatus = result.Payment.PaymentStatus,
                Amount = result.Payment.Amount
            }
        };
        return Ok(ApiResponse<CreateOrderResponse>.Ok(response, "Tạo đơn hàng thành công"));
    }

    [HttpGet("{orderId:int}")]
    public async Task<IActionResult> GetOrderDetail(int orderId, CancellationToken cancellationToken)
    {
        var result = await _orderService.GetOrderByIdAsync(orderId, cancellationToken);
        var response = new GetOrderDetailResponse
        {
            OrderId = result.OrderId,
            OrderCode = result.OrderCode,
            Status = result.Status,
            PaymentStatus = result.PaymentStatus,
            Subtotal = result.Subtotal,
            Note = result.Note,
            DiscountAmount = result.DiscountAmount,
            TotalAmount = result.TotalAmount,
            Items = result.Items.Select(i => new GetOrderDetailItemResponse
            {
                ProductVariantId = i.ProductVariantId,
                SKU = i.SKU,
                ProductName = i.ProductName,
                UnitPrice = i.UnitPrice,
                Quantity = i.Quantity,
                LineTotal = i.LineTotal
            }).ToList(),
            Payment = result.Payment == null ? null : new GetOrderDetailPaymentResponse
            {
                PaymentMethod = result.Payment.PaymentMethod,
                PaymentStatus = result.Payment.PaymentStatus,
                Amount = result.Payment.Amount
            }
        };
        return Ok(ApiResponse<GetOrderDetailResponse>.Ok(response, "Lấy thông tin đơn hàng thành công"));
    }

    [HttpGet]
    public async Task<IActionResult> GetOrders([FromQuery] GetOrdersRequest request, CancellationToken cancellationToken)
    {
        var query = new GetOrdersQuery // Map GetOrdersRequest sang GetOrdersQuery
        {
            CustomerId = request.CustomerId,
            PaymentStatus = request.PaymentStatus,
            Status = request.Status,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        }; 

        var result = await _orderService.GetOrdersAsync(query, cancellationToken); // Gọi service để lấy danh sách đơn hàng theo filter và phân trang
        // Map GetOrdersResult sang GetOrdersResponse
        var response = new GetOrdersResponse
        {
            PageNumber = result.PageNumber,
            PageSize = result.PageSize,
            TotalItems = result.TotalItems,
            TotalPages = result.TotalPages,
            Items = result.Items.Select(o => new GetOrderItemResponse
            {
                OrderId = o.OrderId,
                OrderCode = o.OrderCode,
                CustomerId = o.CustomerId,
                CustomerName = o.CustomerName,
                Status = o.Status,
                PaymentStatus = o.PaymentStatus,
                TotalAmount = o.TotalAmount,
                OrderDate = o.OrderDate
            }).ToList(),
        };
        return Ok(ApiResponse<GetOrdersResponse>.Ok(response, "Lấy danh sách đơn hàng thành công"));
    }

    [HttpPatch("{orderId:int}/cancel")]
    public async Task<IActionResult> CancelOrder(int orderId, CancellationToken cancellationToken)
    {
        var result = await _orderService.CancelOrderResultAsync(orderId, cancellationToken);
        var response = new CancelOrderResponse
        {
            OrderId = result.OrderId,
            OrderCode = result.OrderCode,
            Status = result.Status
        };
        return Ok(ApiResponse<CancelOrderResponse>.Ok(response, "Hủy đơn hàng thành công"));
    }

    [HttpPatch("{orderId:int}/note")]
    public async Task<IActionResult> UpdateOrderNote(int orderId, [FromBody] UpdateOrderNoteRequest request, CancellationToken cancellationToken)
    {
        var dto = new UpdateOrderNoteDto
        {
            OrderId = orderId,
            Note = request.Note
        };
        var result = await _orderService.UpdateOrderNoteAsync(dto, cancellationToken);
        var response = new UpdateOrderNoteResponse
        {
            OrderId = result.OrderId,
            OrderCode = result.OrderCode,
            Note = result.Note
        };
        return Ok(ApiResponse<UpdateOrderNoteResponse>.Ok(response, "Cập nhật ghi chú đơn hàng thành công"));
    }
}


