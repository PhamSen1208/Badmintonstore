using BadmintonStores.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BadmintonStores.Infrastructure.Configurations;

public class ProductVariantConfiguration : IEntityTypeConfiguration<ProductVariant>
{
    public void Configure(EntityTypeBuilder<ProductVariant> builder)
    {
        builder.ToTable("ProductVariants");

        builder.HasKey(pv => pv.Id);

        builder.Property(pv => pv.SKU)
            .IsRequired()
            .HasMaxLength(50);
        
        builder.HasIndex(pv => pv.SKU)
            .IsUnique();

        builder.Property(pv => pv.Price)
            .HasPrecision(18, 2)
            .IsRequired();
        
        builder.Property(pv => pv.SalePrice)
            .HasPrecision(18, 2);

        builder.Property(pv => pv.Weight)
            .HasPrecision(18, 2);
        
        builder.Property(pv => pv.Color)
            .HasMaxLength(100);
        
        builder.Property(pv => pv.Size)
            .HasMaxLength(100);
        
        builder.Property (pv => pv.Status)
            .IsRequired();
        
        builder.Property(pv => pv.CreatedAt)
            .IsRequired();
        
        builder.Property(pv => pv.UpdatedAt);
    }
}
