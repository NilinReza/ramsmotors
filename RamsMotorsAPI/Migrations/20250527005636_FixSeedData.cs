using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RamsMotorsAPI.Migrations
{
    /// <inheritdoc />
    public partial class FixSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "admin_users",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "created_at", "password_hash", "updated_at" },
                values: new object[] { new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "$2a$11$KBpNwTNNgL.zLBZKnmNBf.p3CzW/jIW0XkFk7KZFu0Vjn6RE.2rZW", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "vehicles",
                keyColumn: "vin",
                keyValue: "1C4HJXDG5MW123456",
                columns: new[] { "created_at", "updated_at" },
                values: new object[] { new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "vehicles",
                keyColumn: "vin",
                keyValue: "1FA6P8TH8L5123789",
                columns: new[] { "created_at", "updated_at" },
                values: new object[] { new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "vehicles",
                keyColumn: "vin",
                keyValue: "1HGBH41JXMN109186",
                columns: new[] { "created_at", "updated_at" },
                values: new object[] { new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "admin_users",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "created_at", "password_hash", "updated_at" },
                values: new object[] { new DateTime(2025, 5, 27, 0, 55, 34, 185, DateTimeKind.Utc).AddTicks(7043), "$2a$11$NekrQ.ZyjL8HB02hdA0w6uHZbyc5onVVU4fN57RcBwTFtE..gUqwO", new DateTime(2025, 5, 27, 0, 55, 34, 185, DateTimeKind.Utc).AddTicks(7251) });

            migrationBuilder.UpdateData(
                table: "vehicles",
                keyColumn: "vin",
                keyValue: "1C4HJXDG5MW123456",
                columns: new[] { "created_at", "updated_at" },
                values: new object[] { new DateTime(2025, 5, 27, 0, 55, 34, 186, DateTimeKind.Utc).AddTicks(7035), new DateTime(2025, 5, 27, 0, 55, 34, 186, DateTimeKind.Utc).AddTicks(7035) });

            migrationBuilder.UpdateData(
                table: "vehicles",
                keyColumn: "vin",
                keyValue: "1FA6P8TH8L5123789",
                columns: new[] { "created_at", "updated_at" },
                values: new object[] { new DateTime(2025, 5, 27, 0, 55, 34, 186, DateTimeKind.Utc).AddTicks(7038), new DateTime(2025, 5, 27, 0, 55, 34, 186, DateTimeKind.Utc).AddTicks(7038) });

            migrationBuilder.UpdateData(
                table: "vehicles",
                keyColumn: "vin",
                keyValue: "1HGBH41JXMN109186",
                columns: new[] { "created_at", "updated_at" },
                values: new object[] { new DateTime(2025, 5, 27, 0, 55, 34, 186, DateTimeKind.Utc).AddTicks(6656), new DateTime(2025, 5, 27, 0, 55, 34, 186, DateTimeKind.Utc).AddTicks(6857) });
        }
    }
}
