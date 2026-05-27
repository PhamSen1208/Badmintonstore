using BadmintonStores.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BadmintonStores.Infrastructure.Configurations;

public class InventoryTransactionConfiguration : IEntityTypeConfiguration<InventoryTransaction>
{
    public void Configure(EntityTypeBuilder<InventoryTransaction> builder)
    {
        builder.ToTable("InventoryTransactions");

        builder.HasKey(it => it.Id);

        builder.Property(it => it.TransactionCode)
            .IsRequired()
            .HasMaxLength(50);
        
        builder.HasIndex(it => it.TransactionCode)
            .IsUnique();
    
        builder.Property(it => it.TransactionType)
            .IsRequired();
        
        builder.Property(it => it.Quantity)
            .IsRequired();
        
        builder.Property(it => it.QuantityBefore)
            .IsRequired();

        builder.Property(it => it.QuantityAfter)
            .IsRequired();

        builder.Property(it => it.ReferenceType)
            .IsRequired();
        
        builder.Property(it => it.Note)
            .HasMaxLength(500);
        
        builder.Property(it => it.CreatedAt)
            .IsRequired();
        
        builder.HasOne(it => it.Warehouse)
            .WithMany(w => w.InventoryTransactions)
            .HasForeignKey(it => it.WarehouseId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(it => it.ProductVariant)
            .WithMany()
            .HasForeignKey(it => it.ProductVariantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Order)
            .WithMany(x => x.InventoryTransactions)
            .HasForeignKey(x => x.OrderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.OrderDetail)
            .WithMany()
            .HasForeignKey(x => x.OrderDetailId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}