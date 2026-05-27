using BadmintonStores.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BadmintonStores.Infrastructure.Configurations;

public class OrderDetailConfiguration : IEntityTypeConfiguration<OrderDetail>
{
    public void Configure(EntityTypeBuilder<OrderDetail> builder)
    {
        builder.ToTable("OrderDetails");

        builder.HasKey(od => od.Id);

        builder.Property(od => od.ProductName)
            .IsRequired()
            .HasMaxLength(255);
        
        builder.Property(od => od.VariantName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(od => od.SKU)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(od => od.Quantity) 
            .IsRequired();

        builder.Property(od => od.UnitPrice)
            .HasPrecision(18, 2);
        
        builder.Property(od => od.DiscountAmount)
            .HasPrecision(18, 2);
        
        builder.Property(od => od.LineTotal) // Tổng dòng sau thuế
            .HasPrecision(18, 2);
        
        builder.Property(od => od.CreatedAt)
            .IsRequired();

        builder.HasOne(od => od.Order)
            .WithMany(o => o.OrderDetails)
            .HasForeignKey(od => od.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
