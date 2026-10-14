using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BadmintonStores.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixWishlistModelProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WishLists_Customers_customerId",
                table: "WishLists");

            migrationBuilder.DropForeignKey(
                name: "FK_WishLists_Products_productId",
                table: "WishLists");

            migrationBuilder.RenameColumn(
                name: "productId",
                table: "WishLists",
                newName: "ProductId");

            migrationBuilder.RenameColumn(
                name: "customerId",
                table: "WishLists",
                newName: "CustomerId");

            migrationBuilder.RenameColumn(
                name: "createdAt",
                table: "WishLists",
                newName: "CreatedAt");

            migrationBuilder.RenameIndex(
                name: "IX_WishLists_productId",
                table: "WishLists",
                newName: "IX_WishLists_ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_WishLists_customerId",
                table: "WishLists",
                newName: "IX_WishLists_CustomerId");

            migrationBuilder.AddForeignKey(
                name: "FK_WishLists_Customers_CustomerId",
                table: "WishLists",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WishLists_Products_ProductId",
                table: "WishLists",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WishLists_Customers_CustomerId",
                table: "WishLists");

            migrationBuilder.DropForeignKey(
                name: "FK_WishLists_Products_ProductId",
                table: "WishLists");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "WishLists",
                newName: "productId");

            migrationBuilder.RenameColumn(
                name: "CustomerId",
                table: "WishLists",
                newName: "customerId");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "WishLists",
                newName: "createdAt");

            migrationBuilder.RenameIndex(
                name: "IX_WishLists_ProductId",
                table: "WishLists",
                newName: "IX_WishLists_productId");

            migrationBuilder.RenameIndex(
                name: "IX_WishLists_CustomerId",
                table: "WishLists",
                newName: "IX_WishLists_customerId");

            migrationBuilder.AddForeignKey(
                name: "FK_WishLists_Customers_customerId",
                table: "WishLists",
                column: "customerId",
                principalTable: "Customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WishLists_Products_productId",
                table: "WishLists",
                column: "productId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
