using BadmintonStores.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BadmintonStores.Infrastructure.Configurations;

public class StockConfiguration : IEntityTypeConfiguration<Stock>
{
    public void Configure(EntityTypeBuilder<Stock> builder)
    {
       builder.ToTable("Stocks");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Quantity)
            .IsRequired();
        
        builder.Property(s => s.ReservedQuantity)
            .IsRequired();

        builder.Property(s => s.UpdatedAt);

        builder.HasIndex(s => new { s.WarehouseId, s.ProductVariantId })
            .IsUnique(); // Đảm bảo mỗi cặp WarehouseId và ProductVariantId là duy nhất

        builder.HasOne(s => s.Warehouse)
            .WithMany(w => w.Stocks)
            .HasForeignKey(s => s.WarehouseId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(s => s.ProductVariant)
            .WithMany(pv => pv.Stocks)
            .HasForeignKey(s => s.ProductVariantId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
