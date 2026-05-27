using BadmintonStores.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BadmintonStores.Infrastructure.Configurations;

public class WarehouseConfiguration : IEntityTypeConfiguration<Warehouse>
{
    public void Configure(EntityTypeBuilder<Warehouse> builder)
    {
        builder.ToTable("Warehouses");

        builder.HasKey(w => w.Id);

        builder.Property(w => w.WarehouseCode)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(w => w.WarehouseName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(w => w.Address)
            .HasMaxLength(500);
        
        builder.Property(w => w.Status)
            .IsRequired();
        
        builder.Property(w => w.CreatedAt)
            .IsRequired();

        builder.Property(w => w.UpdatedAt);
    }
}