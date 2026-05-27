namespace BadmintonStores.Application.DTOs.Products;

public class UpdateProductStatusDto
{
    public int ProductId {get; set;}
    public string Status {get; set;} = string.Empty;
}