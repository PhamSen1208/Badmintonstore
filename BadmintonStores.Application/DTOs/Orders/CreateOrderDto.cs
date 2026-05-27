namespace BadmintonStores.Application.DTOs.Orders;

public class CreateOrderDto
{
    public int CustomerId { get; set; }
    public int WarehouseId { get; set; }
    public string? Note { get; set; }
    public List<CreateOrderItemDto> Items { get; set; } = new();
    public CreatePaymentDto? Payment { get; set; }
}

public class CreateOrderItemDto
{
    public int ProductVariantId { get; set; }
    public int Quantity { get; set; }
}

public class CreatePaymentDto
{
    public string PaymentMethod { get; set; } = string.Empty;
}