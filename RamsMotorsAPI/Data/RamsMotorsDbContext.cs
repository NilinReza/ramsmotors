using Microsoft.EntityFrameworkCore;
using RamsMotorsAPI.Models;

namespace RamsMotorsAPI.Data
{
    public class RamsMotorsDbContext : DbContext
    {
        public RamsMotorsDbContext(DbContextOptions<RamsMotorsDbContext> options) : base(options)
        {
        }

        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<VehicleImage> VehicleImages { get; set; }
        public DbSet<VehicleVideo> VehicleVideos { get; set; }
        public DbSet<AdminUser> AdminUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Vehicle entity configuration
            modelBuilder.Entity<Vehicle>(entity =>
            {
                entity.HasKey(v => v.VIN);
                entity.Property(v => v.VIN).HasMaxLength(17).IsRequired();
                entity.Property(v => v.Make).HasMaxLength(50).IsRequired();
                entity.Property(v => v.Model).HasMaxLength(50).IsRequired();
                entity.Property(v => v.Price).HasPrecision(10, 2);
                entity.Property(v => v.Color).HasMaxLength(30);
                entity.Property(v => v.Transmission).HasMaxLength(20);
                entity.Property(v => v.Engine).HasMaxLength(100);
                entity.Property(v => v.BodyStyle).HasMaxLength(30);
                entity.Property(v => v.FuelType).HasMaxLength(20);
                entity.Property(v => v.Drivetrain).HasMaxLength(10);
                entity.Property(v => v.ExteriorColor).HasMaxLength(30);
                entity.Property(v => v.InteriorColor).HasMaxLength(30);
                entity.Property(v => v.Description).HasColumnType("text");
                entity.Property(v => v.Features).HasColumnType("text");
                entity.Property(v => v.ConditionReport).HasColumnType("text");

                // Indexes for better query performance
                entity.HasIndex(v => v.Make);
                entity.HasIndex(v => v.Model);
                entity.HasIndex(v => v.Year);
                entity.HasIndex(v => v.Price);
                entity.HasIndex(v => v.Mileage);
                entity.HasIndex(v => v.IsAvailable);
                entity.HasIndex(v => new { v.Make, v.Model });
            });

            // VehicleImage entity configuration
            modelBuilder.Entity<VehicleImage>(entity =>
            {
                entity.HasKey(vi => vi.Id);
                entity.Property(vi => vi.VehicleVIN).HasMaxLength(17).IsRequired();
                entity.Property(vi => vi.ImageUrl).HasMaxLength(500).IsRequired();
                entity.Property(vi => vi.ImagePath).HasMaxLength(500);
                entity.Property(vi => vi.AltText).HasMaxLength(255);

                entity.HasOne(vi => vi.Vehicle)
                      .WithMany(v => v.Images)
                      .HasForeignKey(vi => vi.VehicleVIN)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(vi => vi.VehicleVIN);
                entity.HasIndex(vi => vi.DisplayOrder);
            });

            // VehicleVideo entity configuration
            modelBuilder.Entity<VehicleVideo>(entity =>
            {
                entity.HasKey(vv => vv.Id);
                entity.Property(vv => vv.VehicleVIN).HasMaxLength(17).IsRequired();
                entity.Property(vv => vv.VideoUrl).HasMaxLength(500).IsRequired();
                entity.Property(vv => vv.VideoPath).HasMaxLength(500);
                entity.Property(vv => vv.Title).HasMaxLength(255);
                entity.Property(vv => vv.Description).HasMaxLength(500);

                entity.HasOne(vv => vv.Vehicle)
                      .WithMany(v => v.Videos)
                      .HasForeignKey(vv => vv.VehicleVIN)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(vv => vv.VehicleVIN);
                entity.HasIndex(vv => vv.DisplayOrder);
            });

            // AdminUser entity configuration
            modelBuilder.Entity<AdminUser>(entity =>
            {
                entity.HasKey(au => au.Id);
                entity.Property(au => au.Username).HasMaxLength(50).IsRequired();
                entity.Property(au => au.Email).HasMaxLength(100).IsRequired();
                entity.Property(au => au.PasswordHash).HasMaxLength(255).IsRequired();
                entity.Property(au => au.FirstName).HasMaxLength(50);
                entity.Property(au => au.LastName).HasMaxLength(50);
                entity.Property(au => au.Role).HasMaxLength(20).HasDefaultValue("admin");

                entity.HasIndex(au => au.Username).IsUnique();
                entity.HasIndex(au => au.Email).IsUnique();
            });

            // Seed data
            SeedData(modelBuilder);
        }        private void SeedData(ModelBuilder modelBuilder)
        {
            // Use fixed dates for seed data to avoid dynamic values issue
            var seedDate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);            // Seed admin user (password: admin123)
            // Pre-generated hash for "admin123" to avoid dynamic value issue
            modelBuilder.Entity<AdminUser>().HasData(
                new AdminUser
                {
                    Id = 1,
                    Username = "admin",
                    Email = "ramsmotorsinc@gmail.com",
                    PasswordHash = "$2a$11$ZHw6ISH97xHs/iYa1KOsxOMx46eaR7Wf3Cj3w8J5hVN/erJiMJznS", // admin123
                    FirstName = "Admin",
                    LastName = "User",
                    Role = "admin",
                    IsActive = true,
                    CreatedAt = seedDate,
                    UpdatedAt = seedDate
                }
            );

            // Seed sample vehicles
            var vehicles = new[]
            {
                new Vehicle
                {
                    VIN = "1HGBH41JXMN109186",
                    Make = "Honda",
                    Model = "Civic",
                    Year = 2023,
                    Price = 28500.00m,
                    Mileage = 15000,
                    Color = "Silver",
                    Transmission = "CVT",
                    Engine = "2.0L 4-Cylinder",
                    BodyStyle = "Sedan",
                    FuelType = "Gasoline",
                    Drivetrain = "FWD",
                    ExteriorColor = "Lunar Silver Metallic",
                    InteriorColor = "Black",
                    Description = "One owner, excellent condition Honda Civic with low mileage.",
                    Features = "Apple CarPlay, Android Auto, Honda Sensing Safety Suite, LED Headlights",
                    ConditionReport = "Excellent condition, no accidents, regular maintenance",
                    IsAvailable = true,
                    CreatedAt = seedDate,
                    UpdatedAt = seedDate
                },
                new Vehicle
                {
                    VIN = "1C4HJXDG5MW123456",
                    Make = "Jeep",
                    Model = "Grand Cherokee",
                    Year = 2022,
                    Price = 45999.00m,
                    Mileage = 28000,
                    Color = "Black",
                    Transmission = "8-Speed Automatic",
                    Engine = "3.6L V6",
                    BodyStyle = "SUV",
                    FuelType = "Gasoline",
                    Drivetrain = "4WD",
                    ExteriorColor = "Diamond Black Crystal",
                    InteriorColor = "Black/Light Frost",
                    Description = "Loaded Grand Cherokee with premium features and capability.",
                    Features = "Uconnect 4C NAV, Panoramic Sunroof, Premium Audio, Heated Seats",
                    ConditionReport = "Very good condition, minor wear on driver seat",
                    IsAvailable = true,
                    CreatedAt = seedDate,
                    UpdatedAt = seedDate
                },
                new Vehicle
                {
                    VIN = "1FA6P8TH8L5123789",
                    Make = "Ford",
                    Model = "Mustang",
                    Year = 2021,
                    Price = 35750.00m,
                    Mileage = 22000,
                    Color = "Red",
                    Transmission = "10-Speed Automatic",
                    Engine = "5.0L V8",
                    BodyStyle = "Coupe",
                    FuelType = "Gasoline",
                    Drivetrain = "RWD",
                    ExteriorColor = "Race Red",
                    InteriorColor = "Ebony",
                    Description = "Powerful Mustang GT with the legendary 5.0L V8 engine.",
                    Features = "SYNC 3, Premium Audio, Performance Package, Brembo Brakes",
                    ConditionReport = "Good condition, adult driven, garage kept",
                    IsAvailable = true,
                    CreatedAt = seedDate,
                    UpdatedAt = seedDate
                }
            };

            modelBuilder.Entity<Vehicle>().HasData(vehicles);
        }
    }
}
