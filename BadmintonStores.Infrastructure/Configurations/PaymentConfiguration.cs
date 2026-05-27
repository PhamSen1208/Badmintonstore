using BadmintonStores.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BadmintonStores.Infrastructure.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable("payments");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.PaymentCode)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(x => x.PaymentCode)
            .IsUnique();

        builder.Property(x => x.Amount)
            .HasPrecision(18, 2);

        builder.Property(x => x.PaymentMethod)
            .IsRequired();

        builder.Property(x => x.PaymentStatus)
            .IsRequired();

        builder.Property(x => x.TransactionId)
            .HasMaxLength(255);

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.UpdatedAt);

        builder.HasOne(x => x.Order)
            .WithMany(x => x.Payments)
            .HasForeignKey(x => x.OrderId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}