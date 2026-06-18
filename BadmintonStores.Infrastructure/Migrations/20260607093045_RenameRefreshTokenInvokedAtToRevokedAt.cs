using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BadmintonStores.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameRefreshTokenInvokedAtToRevokedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "InvokedAt",
                table: "RefreshTokens",
                newName: "RevokedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RevokedAt",
                table: "RefreshTokens",
                newName: "InvokedAt");
        }
    }
}
