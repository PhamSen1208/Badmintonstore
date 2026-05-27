using BadmintonStores.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BadmintonStores.Infrastructure.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.ProductCode)
            .IsRequired()
            .HasMaxLength(50);
        
        builder.HasIndex(p => p.ProductCode)
            .IsUnique();

        builder.Property(p => p.ProductName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(p => p.Description)
            .HasMaxLength(1000);
        
        builder.Property(p => p.Warranty)
            .HasMaxLength(255);

        builder.Property(p => p.BasePrice)
            .HasPrecision(18, 2)
            .IsRequired();

        builder.Property(p => p.Status)
            .IsRequired();

        builder.Property(p => p.CreatedAt)
            .IsRequired();

        builder.Property(p => p.UpdatedAt);

        builder.HasMany(p => p.Variants)
            .WithOne(v => v.Product)
            .HasForeignKey(v => v.ProductId)
            .OnDelete(DeleteBehavior.Restrict); //Không cho phép xóa sản phẩm nếu còn biến thể, tránh mất dữ liệu liên quan đến biến thể khi xóa sản phẩm.
    }
}
