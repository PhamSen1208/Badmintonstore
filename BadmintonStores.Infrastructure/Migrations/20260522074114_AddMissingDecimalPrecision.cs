using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BadmintonStores.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMissingDecimalPrecision : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UpdateAt",
                table: "Warehouses",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "CreateAt",
                table: "Warehouses",
                newName: "CreatedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "Warehouses",
                newName: "UpdateAt");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Warehouses",
                newName: "CreateAt");
        }
    }
}
