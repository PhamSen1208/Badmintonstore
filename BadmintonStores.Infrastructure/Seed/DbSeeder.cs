using BadmintonStores.Domain.Entities;
using BadmintonStores.Domain.Enums;
using BadmintonStores.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BadmintonStores.Infrastructure.Seed;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext dbContext)
    {
        if (await dbContext.Products.AnyAsync()) // Kiểm tra nếu đã có dữ liệu trong bảng Products, nếu có thì không cần seed nữa
        {
            return;
        }

        var now = DateTime.UtcNow;

        var user = new User
        {
            Email = "customer1@example.com",
            Phone = "0900000001",
            PasswordHash = "not-used-in-phase-1",
            Role = UserRole.Customer,
            Status = UserStatus.Active,
            CreatedAt = now
        };

        var customer = new Customer
        {
            User = user,
            CustomerCode = "CUS000001",
            FullName = "Nguyễn Văn Thành",
            Gender = Gender.Male,
            CreatedAt = now
        };

        var warehouse = new Warehouse
        {
            WarehouseCode = "WH000001",
            WarehouseName = "Main Warehouse",
            Address = "Ho Chi Minh City",
            Status = RecordStatus.Active,
            CreatedAt = now
        };

        var product = new Product
        {
            ProductCode = "PROD000001",
            ProductName = "Vợt cầu lông Yonex Nanoray 10F",
            BasePrice = 100000,
            Description = "Vợt cầu lông Yonex Nanoray 10F là một sản phẩm chất lượng cao, phù hợp cho người chơi ở mọi trình độ. Với thiết kế nhẹ và linh hoạt, vợt giúp tăng cường khả năng kiểm soát và phản xạ nhanh trên sân. Đây là lựa chọn lý tưởng cho những ai muốn nâng cao kỹ năng chơi cầu lông của mình.",
            Warranty = "6 months",
            Status = RecordStatus.Active,
            CreatedAt = now
        };

        var variant = new ProductVariant
        {
            Product = product,
            SKU = "YONEX-001",
            Price = 1200000,
            SalePrice = null,
            Color = "Blue",
            Size = "4U",
            Weight = 83,
            Status = RecordStatus.Active,
            CreatedAt = now
        };

        var stock = new Stock
        {
            Warehouse = warehouse,
            ProductVariant = variant,
            Quantity = 10,
            ReservedQuantity = 0,
            UpdatedAt = now
        };

        dbContext.Customers.Add(customer);
        dbContext.Warehouses.Add(warehouse);
        dbContext.ProductVariants.Add(variant);
        dbContext.Stocks.Add(stock);

        await dbContext.SaveChangesAsync();
    }
}