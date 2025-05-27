using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RamsMotorsAPI.Data;
using RamsMotorsAPI.DTOs;
using RamsMotorsAPI.Models;
using RamsMotorsAPI.Services;
using System.Linq.Expressions;

namespace RamsMotorsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehiclesController : ControllerBase    {
        private readonly RamsMotorsDbContext _context;
        private readonly ILogger<VehiclesController> _logger;
        private readonly IFileService _fileService;

        public VehiclesController(RamsMotorsDbContext context, ILogger<VehiclesController> logger, IFileService fileService)
        {
            _context = context;
            _logger = logger;
            _fileService = fileService;
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResponse<VehicleResponse>>> GetVehicles([FromQuery] VehicleFilterRequest filter)
        {
            try
            {
                var query = _context.Vehicles
                    .Include(v => v.Images.OrderBy(i => i.DisplayOrder))
                    .Include(v => v.Videos.OrderBy(v => v.DisplayOrder))
                    .AsQueryable();

                // Apply filters
                query = ApplyFilters(query, filter);

                // Get total count before pagination
                var totalCount = await query.CountAsync();

                // Apply sorting
                query = ApplySorting(query, filter.SortBy, filter.SortOrder);

                // Apply pagination
                var skip = (filter.Page - 1) * filter.PageSize;
                var vehicles = await query
                    .Skip(skip)
                    .Take(filter.PageSize)
                    .ToListAsync();

                var vehicleResponses = vehicles.Select(MapToVehicleResponse).ToList();

                var totalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize);

                var response = new PaginatedResponse<VehicleResponse>
                {
                    Data = vehicleResponses,
                    Page = filter.Page,
                    PageSize = filter.PageSize,
                    TotalCount = totalCount,
                    TotalPages = totalPages,
                    HasNextPage = filter.Page < totalPages,
                    HasPreviousPage = filter.Page > 1
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving vehicles with filters");
                return StatusCode(500, new { message = "An error occurred while retrieving vehicles" });
            }
        }

        [HttpGet("{vin}")]
        public async Task<ActionResult<VehicleResponse>> GetVehicle(string vin)
        {
            try
            {
                var vehicle = await _context.Vehicles
                    .Include(v => v.Images.OrderBy(i => i.DisplayOrder))
                    .Include(v => v.Videos.OrderBy(v => v.DisplayOrder))
                    .FirstOrDefaultAsync(v => v.VIN == vin);

                if (vehicle == null)
                {
                    return NotFound(new { message = "Vehicle not found" });
                }

                var response = MapToVehicleResponse(vehicle);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving vehicle with VIN {VIN}", vin);
                return StatusCode(500, new { message = "An error occurred while retrieving the vehicle" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<VehicleResponse>> CreateVehicle([FromBody] CreateVehicleRequest request)
        {
            try
            {
                // Check if VIN already exists
                var existingVehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.VIN == request.VIN);
                if (existingVehicle != null)
                {
                    return Conflict(new { message = "Vehicle with this VIN already exists" });
                }

                var vehicle = new Vehicle
                {
                    VIN = request.VIN,
                    Make = request.Make,
                    Model = request.Model,
                    Year = request.Year,
                    Price = request.Price,
                    Mileage = request.Mileage,
                    Color = request.Color,
                    Transmission = request.Transmission,
                    Engine = request.Engine,
                    BodyStyle = request.BodyStyle,
                    FuelType = request.FuelType,
                    Drivetrain = request.Drivetrain,
                    ExteriorColor = request.ExteriorColor,
                    InteriorColor = request.InteriorColor,
                    Description = request.Description,
                    Features = request.Features,
                    ConditionReport = request.ConditionReport,
                    IsAvailable = request.IsAvailable,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Vehicles.Add(vehicle);
                await _context.SaveChangesAsync();

                var response = MapToVehicleResponse(vehicle);
                _logger.LogInformation("Vehicle {VIN} created successfully", vehicle.VIN);

                return CreatedAtAction(nameof(GetVehicle), new { vin = vehicle.VIN }, response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating vehicle with VIN {VIN}", request.VIN);
                return StatusCode(500, new { message = "An error occurred while creating the vehicle" });
            }
        }

        [HttpPut("{vin}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<VehicleResponse>> UpdateVehicle(string vin, [FromBody] UpdateVehicleRequest request)
        {
            try
            {
                var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.VIN == vin);
                if (vehicle == null)
                {
                    return NotFound(new { message = "Vehicle not found" });
                }

                vehicle.Make = request.Make;
                vehicle.Model = request.Model;
                vehicle.Year = request.Year;
                vehicle.Price = request.Price;
                vehicle.Mileage = request.Mileage;
                vehicle.Color = request.Color;
                vehicle.Transmission = request.Transmission;
                vehicle.Engine = request.Engine;
                vehicle.BodyStyle = request.BodyStyle;
                vehicle.FuelType = request.FuelType;
                vehicle.Drivetrain = request.Drivetrain;
                vehicle.ExteriorColor = request.ExteriorColor;
                vehicle.InteriorColor = request.InteriorColor;
                vehicle.Description = request.Description;
                vehicle.Features = request.Features;
                vehicle.ConditionReport = request.ConditionReport;
                vehicle.IsAvailable = request.IsAvailable;
                vehicle.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var response = MapToVehicleResponse(vehicle);
                _logger.LogInformation("Vehicle {VIN} updated successfully", vehicle.VIN);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating vehicle with VIN {VIN}", vin);
                return StatusCode(500, new { message = "An error occurred while updating the vehicle" });
            }
        }

        [HttpDelete("{vin}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteVehicle(string vin)
        {
            try
            {
                var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.VIN == vin);
                if (vehicle == null)
                {
                    return NotFound(new { message = "Vehicle not found" });
                }

                _context.Vehicles.Remove(vehicle);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Vehicle {VIN} deleted successfully", vin);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting vehicle with VIN {VIN}", vin);
                return StatusCode(500, new { message = "An error occurred while deleting the vehicle" });
            }
        }

        [HttpGet("filters/options")]
        public async Task<ActionResult> GetFilterOptions()
        {
            try
            {
                var options = new
                {
                    Makes = await _context.Vehicles.Select(v => v.Make).Distinct().OrderBy(m => m).ToListAsync(),
                    Models = await _context.Vehicles.Select(v => v.Model).Distinct().OrderBy(m => m).ToListAsync(),
                    Transmissions = await _context.Vehicles.Select(v => v.Transmission).Distinct().OrderBy(t => t).ToListAsync(),
                    Colors = await _context.Vehicles.Select(v => v.Color).Distinct().OrderBy(c => c).ToListAsync(),
                    Engines = await _context.Vehicles.Select(v => v.Engine).Distinct().OrderBy(e => e).ToListAsync(),
                    BodyStyles = await _context.Vehicles.Select(v => v.BodyStyle).Distinct().OrderBy(b => b).ToListAsync(),
                    FuelTypes = await _context.Vehicles.Select(v => v.FuelType).Distinct().OrderBy(f => f).ToListAsync(),
                    Drivetrains = await _context.Vehicles.Select(v => v.Drivetrain).Distinct().OrderBy(d => d).ToListAsync(),
                    YearRange = new
                    {
                        Min = await _context.Vehicles.MinAsync(v => v.Year),
                        Max = await _context.Vehicles.MaxAsync(v => v.Year)
                    },
                    PriceRange = new
                    {
                        Min = await _context.Vehicles.MinAsync(v => v.Price),
                        Max = await _context.Vehicles.MaxAsync(v => v.Price)
                    },
                    MileageRange = new
                    {
                        Min = await _context.Vehicles.MinAsync(v => v.Mileage),
                        Max = await _context.Vehicles.MaxAsync(v => v.Mileage)
                    }
                };

                return Ok(options);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving filter options");
                return StatusCode(500, new { message = "An error occurred while retrieving filter options" });
            }
        }

        private IQueryable<Vehicle> ApplyFilters(IQueryable<Vehicle> query, VehicleFilterRequest filter)
        {
            if (!string.IsNullOrEmpty(filter.Make))
                query = query.Where(v => v.Make.ToLower().Contains(filter.Make.ToLower()));

            if (!string.IsNullOrEmpty(filter.Model))
                query = query.Where(v => v.Model.ToLower().Contains(filter.Model.ToLower()));

            if (!string.IsNullOrEmpty(filter.Transmission))
                query = query.Where(v => v.Transmission.ToLower().Contains(filter.Transmission.ToLower()));

            if (filter.MinYear.HasValue)
                query = query.Where(v => v.Year >= filter.MinYear.Value);

            if (filter.MaxYear.HasValue)
                query = query.Where(v => v.Year <= filter.MaxYear.Value);

            if (filter.MinPrice.HasValue)
                query = query.Where(v => v.Price >= filter.MinPrice.Value);

            if (filter.MaxPrice.HasValue)
                query = query.Where(v => v.Price <= filter.MaxPrice.Value);

            if (filter.MinMileage.HasValue)
                query = query.Where(v => v.Mileage >= filter.MinMileage.Value);

            if (filter.MaxMileage.HasValue)
                query = query.Where(v => v.Mileage <= filter.MaxMileage.Value);

            if (!string.IsNullOrEmpty(filter.Color))
                query = query.Where(v => v.Color.ToLower().Contains(filter.Color.ToLower()));

            if (!string.IsNullOrEmpty(filter.Engine))
                query = query.Where(v => v.Engine.ToLower().Contains(filter.Engine.ToLower()));

            if (!string.IsNullOrEmpty(filter.BodyStyle))
                query = query.Where(v => v.BodyStyle.ToLower().Contains(filter.BodyStyle.ToLower()));

            if (!string.IsNullOrEmpty(filter.FuelType))
                query = query.Where(v => v.FuelType.ToLower().Contains(filter.FuelType.ToLower()));

            if (!string.IsNullOrEmpty(filter.Drivetrain))
                query = query.Where(v => v.Drivetrain.ToLower().Contains(filter.Drivetrain.ToLower()));

            if (filter.IsAvailable.HasValue)
                query = query.Where(v => v.IsAvailable == filter.IsAvailable.Value);

            return query;
        }

        private IQueryable<Vehicle> ApplySorting(IQueryable<Vehicle> query, string? sortBy, string? sortOrder)
        {
            var isDescending = sortOrder?.ToLower() == "desc";

            return sortBy?.ToLower() switch
            {
                "make" => isDescending ? query.OrderByDescending(v => v.Make) : query.OrderBy(v => v.Make),
                "model" => isDescending ? query.OrderByDescending(v => v.Model) : query.OrderBy(v => v.Model),
                "year" => isDescending ? query.OrderByDescending(v => v.Year) : query.OrderBy(v => v.Year),
                "price" => isDescending ? query.OrderByDescending(v => v.Price) : query.OrderBy(v => v.Price),
                "mileage" => isDescending ? query.OrderByDescending(v => v.Mileage) : query.OrderBy(v => v.Mileage),
                "updatedat" => isDescending ? query.OrderByDescending(v => v.UpdatedAt) : query.OrderBy(v => v.UpdatedAt),
                _ => isDescending ? query.OrderByDescending(v => v.CreatedAt) : query.OrderBy(v => v.CreatedAt)
            };
        }

        private VehicleResponse MapToVehicleResponse(Vehicle vehicle)
        {
            return new VehicleResponse
            {
                VIN = vehicle.VIN,
                Make = vehicle.Make,
                Model = vehicle.Model,
                Year = vehicle.Year,
                Price = vehicle.Price,
                Mileage = vehicle.Mileage,
                Color = vehicle.Color,
                Transmission = vehicle.Transmission,
                Engine = vehicle.Engine,
                BodyStyle = vehicle.BodyStyle,
                FuelType = vehicle.FuelType,
                Drivetrain = vehicle.Drivetrain,
                ExteriorColor = vehicle.ExteriorColor,
                InteriorColor = vehicle.InteriorColor,
                Description = vehicle.Description,
                Features = vehicle.Features,
                ConditionReport = vehicle.ConditionReport,
                IsAvailable = vehicle.IsAvailable,
                CreatedAt = vehicle.CreatedAt,
                UpdatedAt = vehicle.UpdatedAt,
                Images = vehicle.Images.Select(i => new VehicleImageResponse
                {
                    Id = i.Id,
                    ImageUrl = i.ImageUrl,
                    AltText = i.AltText,
                    DisplayOrder = i.DisplayOrder,
                    IsPrimary = i.IsPrimary,
                    UploadedAt = i.UploadedAt
                }).ToList(),
                Videos = vehicle.Videos.Select(v => new VehicleVideoResponse
                {
                    Id = v.Id,
                    VideoUrl = v.VideoUrl,
                    Title = v.Title,
                    Description = v.Description,
                    Duration = v.Duration,
                    FileSize = v.FileSize,
                    DisplayOrder = v.DisplayOrder,
                    UploadedAt = v.UploadedAt                }).ToList()
            };
        }        [HttpPost("{vin}/images")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<List<VehicleImageResponse>>> UploadVehicleImages(string vin, List<IFormFile> images)
        {
            try
            {
                var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.VIN == vin);
                if (vehicle == null)
                {
                    return NotFound(new { message = "Vehicle not found" });
                }

                if (images == null || images.Count == 0)
                {
                    return BadRequest(new { message = "No images provided" });
                }

                var uploadedImages = new List<VehicleImage>();
                var maxDisplayOrder = await _context.VehicleImages
                    .Where(i => i.VehicleVIN == vin)
                    .MaxAsync(i => (int?)i.DisplayOrder) ?? 0;

                foreach (var image in images)
                {
                    if (!_fileService.IsValidImageFile(image))
                    {
                        return BadRequest(new { message = $"Invalid image file: {image.FileName}" });
                    }

                    var imagePath = await _fileService.SaveFileAsync(image, "uploads/images");
                    var vehicleImage = new VehicleImage
                    {
                        VehicleVIN = vin,
                        ImageUrl = imagePath,
                        AltText = $"{vehicle.Year} {vehicle.Make} {vehicle.Model}",
                        DisplayOrder = ++maxDisplayOrder,
                        IsPrimary = !await _context.VehicleImages.AnyAsync(i => i.VehicleVIN == vin),
                        UploadedAt = DateTime.UtcNow
                    };

                    _context.VehicleImages.Add(vehicleImage);
                    uploadedImages.Add(vehicleImage);
                }

                await _context.SaveChangesAsync();

                var response = uploadedImages.Select(i => new VehicleImageResponse
                {
                    Id = i.Id,
                    ImageUrl = i.ImageUrl,
                    AltText = i.AltText,
                    DisplayOrder = i.DisplayOrder,
                    IsPrimary = i.IsPrimary,
                    UploadedAt = i.UploadedAt
                }).ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading images for vehicle {VIN}", vin);
                return StatusCode(500, new { message = "An error occurred while uploading images" });
            }
        }

        [HttpPost("{vin}/videos")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<List<VehicleVideoResponse>>> UploadVehicleVideos(string vin, List<IFormFile> videos)
        {
            try
            {
                var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.VIN == vin);
                if (vehicle == null)
                {
                    return NotFound(new { message = "Vehicle not found" });
                }

                if (videos == null || videos.Count == 0)
                {
                    return BadRequest(new { message = "No videos provided" });
                }

                var uploadedVideos = new List<VehicleVideo>();
                var maxDisplayOrder = await _context.VehicleVideos
                    .Where(v => v.VehicleVIN == vin)
                    .MaxAsync(v => (int?)v.DisplayOrder) ?? 0;

                foreach (var video in videos)
                {
                    if (!_fileService.IsValidVideoFile(video))
                    {
                        return BadRequest(new { message = $"Invalid video file: {video.FileName}" });
                    }

                    var videoPath = await _fileService.SaveFileAsync(video, "uploads/videos");
                    var vehicleVideo = new VehicleVideo
                    {
                        VehicleVIN = vin,
                        VideoUrl = videoPath,
                        Title = $"{vehicle.Year} {vehicle.Make} {vehicle.Model} Video",
                        Description = "Vehicle showcase video",
                        FileSize = video.Length,
                        DisplayOrder = ++maxDisplayOrder,
                        UploadedAt = DateTime.UtcNow
                    };

                    _context.VehicleVideos.Add(vehicleVideo);
                    uploadedVideos.Add(vehicleVideo);
                }

                await _context.SaveChangesAsync();

                var response = uploadedVideos.Select(v => new VehicleVideoResponse
                {
                    Id = v.Id,
                    VideoUrl = v.VideoUrl,
                    Title = v.Title,
                    Description = v.Description,
                    Duration = v.Duration,
                    FileSize = v.FileSize,
                    DisplayOrder = v.DisplayOrder,
                    UploadedAt = v.UploadedAt
                }).ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading videos for vehicle {VIN}", vin);
                return StatusCode(500, new { message = "An error occurred while uploading videos" });
            }
        }

        [HttpDelete("{vehicleVin}/images/{imageId}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteVehicleImage(string vehicleVin, int imageId)
        {
            try
            {
                var image = await _context.VehicleImages
                    .FirstOrDefaultAsync(i => i.Id == imageId && i.VehicleVIN == vehicleVin);

                if (image == null)
                {
                    return NotFound(new { message = "Image not found" });
                }

                await _fileService.DeleteFileAsync(image.ImageUrl);
                _context.VehicleImages.Remove(image);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting image {ImageId} for vehicle {VehicleVin}", imageId, vehicleVin);
                return StatusCode(500, new { message = "An error occurred while deleting the image" });
            }
        }

        [HttpDelete("{vehicleVin}/videos/{videoId}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteVehicleVideo(string vehicleVin, int videoId)
        {
            try
            {
                var video = await _context.VehicleVideos
                    .FirstOrDefaultAsync(v => v.Id == videoId && v.VehicleVIN == vehicleVin);

                if (video == null)
                {
                    return NotFound(new { message = "Video not found" });
                }

                await _fileService.DeleteFileAsync(video.VideoUrl);
                _context.VehicleVideos.Remove(video);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting video {VideoId} for vehicle {VehicleVin}", videoId, vehicleVin);
                return StatusCode(500, new { message = "An error occurred while deleting the video" });
            }
        }
    }
}
