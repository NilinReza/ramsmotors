using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RamsMotorsAPI.Models
{
    [Table("vehicles")]
    public class Vehicle
    {
        [Key]
        [Column("vin")]
        [MaxLength(17)]
        public string VIN { get; set; } = string.Empty;

        [Column("make")]
        [MaxLength(50)]
        [Required]
        public string Make { get; set; } = string.Empty;

        [Column("model")]
        [MaxLength(50)]
        [Required]
        public string Model { get; set; } = string.Empty;

        [Column("year")]
        [Required]
        public int Year { get; set; }        [Column("price", TypeName = "decimal(10,2)")]
        [Required]
        public decimal Price { get; set; }

        [Column("mileage")]
        [Required]
        public int Mileage { get; set; }

        [Column("color")]
        [MaxLength(30)]
        public string Color { get; set; } = string.Empty;

        [Column("transmission")]
        [MaxLength(20)]
        public string Transmission { get; set; } = string.Empty;

        [Column("engine")]
        [MaxLength(100)]
        public string Engine { get; set; } = string.Empty;

        [Column("body_style")]
        [MaxLength(30)]
        public string BodyStyle { get; set; } = string.Empty;

        [Column("fuel_type")]
        [MaxLength(20)]
        public string FuelType { get; set; } = string.Empty;

        [Column("drivetrain")]
        [MaxLength(10)]
        public string Drivetrain { get; set; } = string.Empty;

        [Column("exterior_color")]
        [MaxLength(30)]
        public string ExteriorColor { get; set; } = string.Empty;

        [Column("interior_color")]
        [MaxLength(30)]
        public string InteriorColor { get; set; } = string.Empty;        [Column("description", TypeName = "text")]
        public string Description { get; set; } = string.Empty;

        [Column("features", TypeName = "text")]
        public string Features { get; set; } = string.Empty;

        [Column("condition_report", TypeName = "text")]
        public string ConditionReport { get; set; } = string.Empty;

        [Column("is_available")]
        public bool IsAvailable { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual ICollection<VehicleImage> Images { get; set; } = new List<VehicleImage>();
        public virtual ICollection<VehicleVideo> Videos { get; set; } = new List<VehicleVideo>();
    }
}
