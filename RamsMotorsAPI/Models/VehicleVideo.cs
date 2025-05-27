using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RamsMotorsAPI.Models
{
    [Table("vehicle_videos")]
    public class VehicleVideo
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("vehicle_vin")]
        [MaxLength(17)]
        [Required]
        public string VehicleVIN { get; set; } = string.Empty;

        [Column("video_url")]
        [MaxLength(500)]
        [Required]
        public string VideoUrl { get; set; } = string.Empty;

        [Column("video_path")]
        [MaxLength(500)]
        public string VideoPath { get; set; } = string.Empty;

        [Column("title")]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [Column("description")]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Column("duration")]
        public int Duration { get; set; } = 0; // in seconds

        [Column("file_size")]
        public long FileSize { get; set; } = 0; // in bytes

        [Column("display_order")]
        public int DisplayOrder { get; set; } = 0;

        [Column("uploaded_at")]
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("VehicleVIN")]
        public virtual Vehicle Vehicle { get; set; } = null!;
    }
}
