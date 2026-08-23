using BadmintonStores.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BadmintonStores.Infrastructure.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");

        builder.HasKey(o => o.Id);

        builder.Property(o => o.OrderCode)
            .IsRequired()
            .HasMaxLength(30);
        
        builder.HasIndex(o => o.OrderCode)
            .IsUnique();
        
        builder.Property(o => o.OrderDate)
            .IsRequired();
        
        builder.Property(o => o.Status)
            .IsRequired();
        
        builder.Property(o => o.PaymentStatus)
            .IsRequired();
        
        builder.Property(o => o.Subtotal)
            .HasPrecision(18, 2)
            .IsRequired();

        builder.Property(o => o.TotalAmount)
            .HasPrecision(18, 2)
            .IsRequired();

        builder.Property(o => o.DiscountAmount)
            .HasPrecision(18, 2)
            .IsRequired();  

        builder.Property(o => o.ShippingFee)
            .HasPrecision(18, 2);

        builder.Property(o => o.TaxRate)
            .HasPrecision(5, 4);

        builder.Property(o => o.TaxAmount)
            .HasPrecision(18, 2);

        builder.Property(o => o.RecipientName)
            .HasMaxLength(100);

        builder.Property(o => o.ShippingPhone)
            .HasMaxLength(20);

        builder.Property(o => o.ShippingAddress)
            .HasMaxLength(500);

        builder.Property(o => o.Note)
            .HasMaxLength(500);

        builder.Property(o => o.CreatedAt)
            .IsRequired();
        
        builder.Property(o => o.UpdatedAt);

    }
}