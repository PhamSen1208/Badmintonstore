using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BadmintonStores.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBrandAndCategoryCodes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Province",
                table: "CustomerAddresses",
                newName: "City");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "ProductImages",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CategoryCode",
                table: "Categories",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BrandCode",
                table: "Brands",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_CategoryCode",
                table: "Categories",
                column: "CategoryCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Brands_BrandCode",
                table: "Brands",
                column: "BrandCode",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Categories_CategoryCode",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Brands_BrandCode",
                table: "Brands");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "ProductImages");

            migrationBuilder.DropColumn(
                name: "CategoryCode",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "BrandCode",
                table: "Brands");

            migrationBuilder.RenameColumn(
                name: "City",
                table: "CustomerAddresses",
                newName: "Province");
        }
    }
}
