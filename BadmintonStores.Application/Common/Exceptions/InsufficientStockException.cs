namespace BadmintonStores.Application.Common.Exceptions;

public class InsufficientStockException : Exception
{
    public string Code { get; } = "INSUFFICIENT_STOCK";
    public object Details { get; }

    public InsufficientStockException(object details)
        : base("Một số sản phẩm không đủ tồn kho.")
    {
        Details = details;
    }
}