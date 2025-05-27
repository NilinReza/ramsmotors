using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RamsMotorsAPI.Models
{
    [Table("admin_users")]
    public class AdminUser
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("username")]
        [MaxLength(50)]
        [Required]
        public string Username { get; set; } = string.Empty;

        [Column("email")]
        [MaxLength(100)]
        [Required]
        public string Email { get; set; } = string.Empty;

        [Column("password_hash")]
        [MaxLength(255)]
        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Column("first_name")]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Column("last_name")]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Column("role")]
        [MaxLength(20)]
        public string Role { get; set; } = "admin";

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("last_login")]
        public DateTime? LastLogin { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
