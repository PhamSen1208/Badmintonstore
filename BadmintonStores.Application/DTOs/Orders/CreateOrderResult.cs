namespace BadmintonStores.Application.DTOs.Orders;

public class CreateOrderResult
{
    public int OrderId { get; set; }
    public string OrderCode { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;

    public decimal Subtotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal TotalAmount { get; set; }

    public List<CreateOrderItemResult> Items { get; set; } = new();
    public CreateOrderPaymentResult? Payment { get; set; }
}

public class CreateOrderItemResult
{
    public int ProductVariantId { get; set; }
    public string SKU { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal LineTotal { get; set; }
}

public class CreateOrderPaymentResult
{
    public string PaymentMethod { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}