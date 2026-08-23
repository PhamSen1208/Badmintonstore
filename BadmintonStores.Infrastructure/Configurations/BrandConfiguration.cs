using BadmintonStores.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BadmintonStores.Infrastructure.Configurations;

public class BrandConfiguration : IEntityTypeConfiguration<Brand>
{
    public void Configure(EntityTypeBuilder<Brand> builder)
    {
        builder.ToTable("Brands");

        builder.HasKey(b => b.Id);

        builder.Property(b => b.BrandCode)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(b => b.BrandCode)
            .IsUnique();

        builder.Property(b => b.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(b => b.Slug)
            .IsRequired()
            .HasMaxLength(120);

        builder.HasIndex(b => b.Slug)
            .IsUnique();

        builder.Property(b => b.LogoUrl)
            .HasMaxLength(500);

        builder.Property(b => b.Description)
            .HasMaxLength(500);
    }
}
