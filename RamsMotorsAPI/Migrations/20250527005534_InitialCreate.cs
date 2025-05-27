using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace RamsMotorsAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "admin_users",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    username = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    email = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    password_hash = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    first_name = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    last_name = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    role = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false, defaultValue: "admin"),
                    is_active = table.Column<bool>(type: "INTEGER", nullable: false),
                    last_login = table.Column<DateTime>(type: "TEXT", nullable: true),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    updated_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_admin_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "vehicles",
                columns: table => new
                {
                    vin = table.Column<string>(type: "TEXT", maxLength: 17, nullable: false),
                    make = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    model = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    year = table.Column<int>(type: "INTEGER", nullable: false),
                    price = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    mileage = table.Column<int>(type: "INTEGER", nullable: false),
                    color = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false),
                    transmission = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    engine = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    body_style = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false),
                    fuel_type = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    drivetrain = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false),
                    exterior_color = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false),
                    interior_color = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    features = table.Column<string>(type: "text", nullable: false),
                    condition_report = table.Column<string>(type: "text", nullable: false),
                    is_available = table.Column<bool>(type: "INTEGER", nullable: false),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    updated_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_vehicles", x => x.vin);
                });

            migrationBuilder.CreateTable(
                name: "vehicle_images",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    vehicle_vin = table.Column<string>(type: "TEXT", maxLength: 17, nullable: false),
                    image_url = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    image_path = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    alt_text = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    display_order = table.Column<int>(type: "INTEGER", nullable: false),
                    is_primary = table.Column<bool>(type: "INTEGER", nullable: false),
                    uploaded_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_vehicle_images", x => x.id);
                    table.ForeignKey(
                        name: "FK_vehicle_images_vehicles_vehicle_vin",
                        column: x => x.vehicle_vin,
                        principalTable: "vehicles",
                        principalColumn: "vin",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "vehicle_videos",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    vehicle_vin = table.Column<string>(type: "TEXT", maxLength: 17, nullable: false),
                    video_url = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    video_path = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    title = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    duration = table.Column<int>(type: "INTEGER", nullable: false),
                    file_size = table.Column<long>(type: "INTEGER", nullable: false),
                    display_order = table.Column<int>(type: "INTEGER", nullable: false),
                    uploaded_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_vehicle_videos", x => x.id);
                    table.ForeignKey(
                        name: "FK_vehicle_videos_vehicles_vehicle_vin",
                        column: x => x.vehicle_vin,
                        principalTable: "vehicles",
                        principalColumn: "vin",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "admin_users",
                columns: new[] { "id", "created_at", "email", "first_name", "is_active", "last_login", "last_name", "password_hash", "role", "updated_at", "username" },
                values: new object[] { 1, new DateTime(2025, 5, 27, 0, 55, 34, 185, DateTimeKind.Utc).AddTicks(7043), "admin@ramsmotors.com", "Admin", true, null, "User", "$2a$11$NekrQ.ZyjL8HB02hdA0w6uHZbyc5onVVU4fN57RcBwTFtE..gUqwO", "admin", new DateTime(2025, 5, 27, 0, 55, 34, 185, DateTimeKind.Utc).AddTicks(7251), "admin" });

            migrationBuilder.InsertData(
                table: "vehicles",
                columns: new[] { "vin", "body_style", "color", "condition_report", "created_at", "description", "drivetrain", "engine", "exterior_color", "features", "fuel_type", "interior_color", "is_available", "make", "mileage", "model", "price", "transmission", "updated_at", "year" },
                values: new object[,]
                {
                    { "1C4HJXDG5MW123456", "SUV", "Black", "Very good condition, minor wear on driver seat", new DateTime(2025, 5, 27, 0, 55, 34, 186, DateTimeKind.Utc).AddTicks(7035), "Loaded Grand Cherokee with premium features and capability.", "4WD", "3.6L V6", "Diamond Black Crystal", "Uconnect 4C NAV, Panoramic Sunroof, Premium Audio, Heated Seats", "Gasoline", "Black/Light Frost", true, "Jeep", 28000, "Grand Cherokee", 45999.00m, "8-Speed Automatic", new DateTime(2025, 5, 27, 0, 55, 34, 186, DateTimeKind.Utc).AddTicks(7035), 2022 },
                    { "1FA6P8TH8L5123789", "Coupe", "Red", "Good condition, adult driven, garage kept", new DateTime(2025, 5, 27, 0, 55, 34, 186, DateTimeKind.Utc).AddTicks(7038), "Powerful Mustang GT with the legendary 5.0L V8 engine.", "RWD", "5.0L V8", "Race Red", "SYNC 3, Premium Audio, Performance Package, Brembo Brakes", "Gasoline", "Ebony", true, "Ford", 22000, "Mustang", 35750.00m, "10-Speed Automatic", new DateTime(2025, 5, 27, 0, 55, 34, 186, DateTimeKind.Utc).AddTicks(7038), 2021 },
                    { "1HGBH41JXMN109186", "Sedan", "Silver", "Excellent condition, no accidents, regular maintenance", new DateTime(2025, 5, 27, 0, 55, 34, 186, DateTimeKind.Utc).AddTicks(6656), "One owner, excellent condition Honda Civic with low mileage.", "FWD", "2.0L 4-Cylinder", "Lunar Silver Metallic", "Apple CarPlay, Android Auto, Honda Sensing Safety Suite, LED Headlights", "Gasoline", "Black", true, "Honda", 15000, "Civic", 28500.00m, "CVT", new DateTime(2025, 5, 27, 0, 55, 34, 186, DateTimeKind.Utc).AddTicks(6857), 2023 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_admin_users_email",
                table: "admin_users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_admin_users_username",
                table: "admin_users",
                column: "username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_vehicle_images_display_order",
                table: "vehicle_images",
                column: "display_order");

            migrationBuilder.CreateIndex(
                name: "IX_vehicle_images_vehicle_vin",
                table: "vehicle_images",
                column: "vehicle_vin");

            migrationBuilder.CreateIndex(
                name: "IX_vehicle_videos_display_order",
                table: "vehicle_videos",
                column: "display_order");

            migrationBuilder.CreateIndex(
                name: "IX_vehicle_videos_vehicle_vin",
                table: "vehicle_videos",
                column: "vehicle_vin");

            migrationBuilder.CreateIndex(
                name: "IX_vehicles_is_available",
                table: "vehicles",
                column: "is_available");

            migrationBuilder.CreateIndex(
                name: "IX_vehicles_make",
                table: "vehicles",
                column: "make");

            migrationBuilder.CreateIndex(
                name: "IX_vehicles_make_model",
                table: "vehicles",
                columns: new[] { "make", "model" });

            migrationBuilder.CreateIndex(
                name: "IX_vehicles_mileage",
                table: "vehicles",
                column: "mileage");

            migrationBuilder.CreateIndex(
                name: "IX_vehicles_model",
                table: "vehicles",
                column: "model");

            migrationBuilder.CreateIndex(
                name: "IX_vehicles_price",
                table: "vehicles",
                column: "price");

            migrationBuilder.CreateIndex(
                name: "IX_vehicles_year",
                table: "vehicles",
                column: "year");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "admin_users");

            migrationBuilder.DropTable(
                name: "vehicle_images");

            migrationBuilder.DropTable(
                name: "vehicle_videos");

            migrationBuilder.DropTable(
                name: "vehicles");
        }
    }
}
