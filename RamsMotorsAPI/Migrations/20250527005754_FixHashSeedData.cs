using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RamsMotorsAPI.Migrations
{
    /// <inheritdoc />
    public partial class FixHashSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "admin_users",
                keyColumn: "id",
                keyValue: 1,
                column: "password_hash",
                value: "$2a$11$9R8yQx8YbS6Xx8Yf6yJ6POBbZYmXKFyU4mR5Xt2VqYrjZlKdLmXGe");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "admin_users",
                keyColumn: "id",
                keyValue: 1,
                column: "password_hash",
                value: "$2a$11$KBpNwTNNgL.zLBZKnmNBf.p3CzW/jIW0XkFk7KZFu0Vjn6RE.2rZW");
        }
    }
}
