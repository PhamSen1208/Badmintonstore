namespace BadmintonStores.Application.DTOs.Orders;

public class GetOrderDetailResult
{
    public int OrderId { get; set; }
    public string OrderCode { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? RecipientName { get; set; }
    public string? ShippingPhone { get; set; }
    public string? ShippingAddress { get; set; }
    public string? Note { get; set; }

    public decimal Subtotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal TaxRate { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal TotalAmount { get; set; }

    public List<GetOrderDetailItemResult> Items { get; set; } = new();
    public GetOrderDetailPaymentResult? Payment { get; set; }
}

public class GetOrderDetailItemResult
{
    public int ProductVariantId { get; set; }
    public string SKU { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal LineTotal { get; set; }
}

public class GetOrderDetailPaymentResult
{
    public string PaymentMethod { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}