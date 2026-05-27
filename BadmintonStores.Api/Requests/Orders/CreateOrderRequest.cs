namespace BadmintonStores.Api.Requests.Orders;

public class CreateOrderRequest
{
    public int CustomerId {get; set;}
    public int WarehouseId {get; set;}
    public string? Note {get; set;}

    public List<CreateOrderItemRequest> Items {get; set;} = new();
    public CreatePaymentRequest? Payment {get; set;}
}

public class CreateOrderItemRequest
{
    public int ProductVariantId {get; set;}
    public int Quantity {get; set;}
}

public class CreatePaymentRequest
{
    public string PaymentMethod {get; set;} = string.Empty;
}