using BadmintonStores.Domain.Entities;
using BadmintonStores.Domain.Enums;
using BadmintonStores.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BadmintonStores.Infrastructure.Seed;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext dbContext)
    {
        if (!await dbContext.Coupons.AnyAsync())
        {
            var coupons = new List<Coupon>
            {
                new Coupon
                {
                    CouponCode = "CHAOBANMOI",
                    Description = "Giảm 10% tối đa 50.000đ cho đơn hàng từ 300.000đ",
                    DiscountType = DiscountTypes.Percentage,
                    DiscountValue = 10,
                    MinOrderAmount = 300000,
                    MaxDiscountAmount = 50000,
                    Quantity = 500,
                    QuantityUsed = 0,
                    MaxUsageUser = 1,
                    StartDate = DateTime.UtcNow.AddDays(-7),
                    EndDate = DateTime.UtcNow.AddMonths(3),
                    IsActive = true
                },
                new Coupon
                {
                    CouponCode = "FREESHIP30",
                    Description = "Giảm trực tiếp 30.000đ tiền vận chuyển cho đơn từ 500.000đ",
                    DiscountType = DiscountTypes.FixedAmount,
                    DiscountValue = 30000,
                    MinOrderAmount = 500000,
                    MaxDiscountAmount = 30000,
                    Quantity = 200,
                    QuantityUsed = 0,
                    MaxUsageUser = 2,
                    StartDate = DateTime.UtcNow.AddDays(-7),
                    EndDate = DateTime.UtcNow.AddMonths(3),
                    IsActive = true
                },
                new Coupon
                {
                    CouponCode = "YONEXVIP",
                    Description = "Giảm 15% tối đa 200.000đ cho đơn hàng cao cấp từ 1.200.000đ",
                    DiscountType = DiscountTypes.Percentage,
                    DiscountValue = 15,
                    MinOrderAmount = 1200000,
                    MaxDiscountAmount = 200000,
                    Quantity = 100,
                    QuantityUsed = 0,
                    MaxUsageUser = 1,
                    StartDate = DateTime.UtcNow.AddDays(-7),
                    EndDate = DateTime.UtcNow.AddMonths(3),
                    IsActive = true
                }
            };

            await dbContext.Coupons.AddRangeAsync(coupons);
            await dbContext.SaveChangesAsync();
        }

        if(!await dbContext.Products.AnyAsync(x => x.ProductName.Contains("Cước")))
        {
            var stringProducts = new List<Product>
            {
                new Product
                {
                    ProductCode = "STRING-BG65",
                    ProductName = "Cước vợt Yonex BG 65",
                    BasePrice = 120000,
                    Description = "Dây cước sợi to 0.70mm, cực kỳ bền bỉ, trợ lực tốt cho người chơi phong trào.",
                    Status = RecordStatus.Active,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    ProductCode = "STRING-BG66UM",
                    ProductName = "Cước vợt Yonex BG 66 Ultimax",
                    BasePrice = 160000,
                    Description = "Dây cước trợ lực đỉnh cao 0.65mm, tiếng nổ vang đanh tai, được ưa chuộng nhất.",
                    Status = RecordStatus.Active,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    ProductCode = "STRING-NBG95",
                    ProductName = "Cước vợt Yonex Nanogy 95",
                    BasePrice = 170000,
                    Description = "Phủ lớp hợp chất Nano, cảm giác cầu êm ái, độ bền và độ nảy toàn diện.",
                    Status = RecordStatus.Active,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    ProductCode = "STRING-EXB65",
                    ProductName = "Cước vợt Yonex Exbolt 65",
                    BasePrice = 180000,
                    Description = "Sợi vật liệu Forged Fiber độc quyền, tốc độ vung vợt và phản tạt siêu nhanh.",
                    Status = RecordStatus.Active,
                    CreatedAt = DateTime.UtcNow
                }
            };
            await dbContext.Products.AddRangeAsync(stringProducts);
            await dbContext.SaveChangesAsync();
        }
        
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