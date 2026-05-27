namespace BadmintonStores.Api.Responses.Orders;

public class CreateOrderResponse
{
    public int OrderId {get; set;}
    public string OrderCode {get; set;} = string.Empty;
    public string Status {get; set;} = string.Empty;
    public string PaymentStatus {get; set;} = string.Empty;

    public decimal Subtotal {get; set;}
    public decimal DiscountAmount {get; set;}
    public decimal TotalAmount {get; set;}

    public List<CreateOrderItemResponse> Items {get; set;} = new();
    public CreateOrderPaymentResponse? Payment {get; set;}
}

public class CreateOrderItemResponse
{
    public int ProductVariantId {get; set;}
    public string ProductName {get; set;} = string.Empty;
    public string SKU {get; set;} = string.Empty;
    public string? VariantName {get; set;}
    public decimal UnitPrice {get; set;}
    public decimal LineTotal {get; set;}
    public int Quantity {get; set;}
}

public class CreateOrderPaymentResponse
{
    public string PaymentMethod { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}