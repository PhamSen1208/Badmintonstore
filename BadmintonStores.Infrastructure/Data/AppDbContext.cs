using Microsoft.EntityFrameworkCore;
using BadmintonStores.Domain.Entities;
using System.Security.Cryptography.X509Certificates;

namespace BadmintonStores.Infrastructure.Data;

public class AppDbContext  : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
    }

    public DbSet<User> Users => Set<User>(); // DbSet cho entity User
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<Warehouse> Warehouses => Set<Warehouse>();
    public DbSet<Stock> Stocks => Set<Stock>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderDetail> OrderDetails => Set<OrderDetail>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<InventoryTransaction> InventoryTransactions => Set<InventoryTransaction>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<CustomerAddress> CustomerAddresses => Set<CustomerAddress>();
    public DbSet<WishList> WishLists => Set<WishList>();
    public DbSet<ProductReview> ProductReviews => Set<ProductReview>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<CouponHistory> CouponHistories => Set<CouponHistory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);    
    }
}


