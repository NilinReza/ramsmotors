using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RamsMotorsAPI.Models
{
    [Table("vehicle_images")]
    public class VehicleImage
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("vehicle_vin")]
        [MaxLength(17)]
        [Required]
        public string VehicleVIN { get; set; } = string.Empty;

        [Column("image_url")]
        [MaxLength(500)]
        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        [Column("image_path")]
        [MaxLength(500)]
        public string ImagePath { get; set; } = string.Empty;

        [Column("alt_text")]
        [MaxLength(255)]
        public string AltText { get; set; } = string.Empty;

        [Column("display_order")]
        public int DisplayOrder { get; set; } = 0;

        [Column("is_primary")]
        public bool IsPrimary { get; set; } = false;

        [Column("uploaded_at")]
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("VehicleVIN")]
        public virtual Vehicle Vehicle { get; set; } = null!;
    }
}
