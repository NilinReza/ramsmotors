using System.Net;

namespace RamsMotorsAPI.Services
{
    public interface IFileService
    {
        Task<string> SaveFileAsync(IFormFile file, string directory);
        Task DeleteFileAsync(string filePath);
        bool IsValidImageFile(IFormFile file);
        bool IsValidVideoFile(IFormFile file);
    }

    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly long _maxImageSize = 10 * 1024 * 1024; // 10MB
        private readonly long _maxVideoSize = 100 * 1024 * 1024; // 100MB
        private readonly string[] _allowedImageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        private readonly string[] _allowedVideoExtensions = { ".mp4", ".avi", ".mov", ".wmv", ".webm" };

        public FileService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<string> SaveFileAsync(IFormFile file, string directory)
        {
            try
            {
                // Create directory if it doesn't exist
                var uploadPath = Path.Combine(_environment.WebRootPath, directory);
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                // Generate unique filename
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                var fileName = $"{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(uploadPath, fileName);

                // Save file
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                // Return relative path for URL generation
                return $"/{directory}/{fileName}";
            }
            catch (Exception ex)
            {
                throw new Exception($"Error saving file: {ex.Message}", ex);
            }
        }

        public async Task DeleteFileAsync(string filePath)
        {
            try
            {
                if (string.IsNullOrEmpty(filePath)) return;

                var fullPath = Path.Combine(_environment.WebRootPath, filePath.TrimStart('/'));
                if (File.Exists(fullPath))
                {
                    await Task.Run(() => File.Delete(fullPath));
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting file: {ex.Message}", ex);
            }
        }

        public bool IsValidImageFile(IFormFile file)
        {
            if (file == null || file.Length == 0) return false;
            if (file.Length > _maxImageSize) return false;

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            return _allowedImageExtensions.Contains(extension);
        }

        public bool IsValidVideoFile(IFormFile file)
        {
            if (file == null || file.Length == 0) return false;
            if (file.Length > _maxVideoSize) return false;

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            return _allowedVideoExtensions.Contains(extension);
        }
    }
}
