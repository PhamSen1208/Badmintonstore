using BadmintonStores.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BadmintonStores.Infrastructure.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.HasIndex(u => u.Email)
            .IsUnique();
        
        builder.Property(u => u.Phone)
            .HasMaxLength(15);

        builder.Property(u => u.PasswordHash)
            .IsRequired()
            .HasMaxLength(500);
        
        builder.Property(u => u.Role)
            .IsRequired();
        
        builder.Property(u => u.Status)
            .IsRequired();
        
        builder.Property(u => u.CreatedAt)
            .IsRequired();

        builder.Property(u => u.UpdatedAt);

        builder.HasOne(u => u.Customer)
            .WithOne(c => c.User)
            .HasForeignKey<Customer>(c => c.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}