using BadmintonStores.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BadmintonStores.Infrastructure.Configurations;

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.ToTable("RefreshTokens");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.TokenHash)
            .IsRequired()
            .HasMaxLength(128);

        builder.HasIndex(x => x.TokenHash)
            .IsUnique();

        builder.Property(x => x.ExpiresAt)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.CreatedByIp)
            .HasMaxLength(45);

        builder.Property(x => x.RevokedByIp)
            .HasMaxLength(45);

        builder.Property(x => x.ReplacedByTokenHash)
            .HasMaxLength(128);

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}