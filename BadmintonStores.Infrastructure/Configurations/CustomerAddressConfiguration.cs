using BadmintonStores.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BadmintonStores.Infrastructure.Configurations;

public class CustomerAddressConfiguration : IEntityTypeConfiguration<CustomerAddress>
{
    public void Configure(EntityTypeBuilder<CustomerAddress> builder)
    {
        builder.ToTable("CustomerAddresses");

        builder.HasKey(ca => ca.Id);

        builder.Property(ca => ca.RecipientName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(ca => ca.PhoneNumber)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(ca => ca.City)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(ca => ca.District)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(ca => ca.Ward)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(ca => ca.AddressDetail)
            .IsRequired()
            .HasMaxLength(255);

        builder.HasOne(ca => ca.Customer)
            .WithMany(c => c.Addresses)
            .HasForeignKey(ca => ca.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
