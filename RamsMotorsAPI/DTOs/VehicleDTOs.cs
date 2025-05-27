namespace RamsMotorsAPI.DTOs
{
    public class VehicleFilterRequest
    {
        public string? Make { get; set; }
        public string? Model { get; set; }
        public string? Transmission { get; set; }
        public int? MinYear { get; set; }
        public int? MaxYear { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? MinMileage { get; set; }
        public int? MaxMileage { get; set; }
        public string? Color { get; set; }
        public string? Engine { get; set; }
        public string? BodyStyle { get; set; }
        public string? FuelType { get; set; }
        public string? Drivetrain { get; set; }
        public bool? IsAvailable { get; set; } = true;
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SortBy { get; set; } = "createdAt";
        public string? SortOrder { get; set; } = "desc";
    }

    public class VehicleResponse
    {
        public string VIN { get; set; } = string.Empty;
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public decimal Price { get; set; }
        public int Mileage { get; set; }
        public string Color { get; set; } = string.Empty;
        public string Transmission { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
        public string BodyStyle { get; set; } = string.Empty;
        public string FuelType { get; set; } = string.Empty;
        public string Drivetrain { get; set; } = string.Empty;
        public string ExteriorColor { get; set; } = string.Empty;
        public string InteriorColor { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Features { get; set; } = string.Empty;
        public string ConditionReport { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<VehicleImageResponse> Images { get; set; } = new();
        public List<VehicleVideoResponse> Videos { get; set; } = new();
    }

    public class VehicleImageResponse
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string AltText { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
        public bool IsPrimary { get; set; }
        public DateTime UploadedAt { get; set; }
    }

    public class VehicleVideoResponse
    {
        public int Id { get; set; }
        public string VideoUrl { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Duration { get; set; }
        public long FileSize { get; set; }
        public int DisplayOrder { get; set; }
        public DateTime UploadedAt { get; set; }
    }

    public class CreateVehicleRequest
    {
        public string VIN { get; set; } = string.Empty;
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public decimal Price { get; set; }
        public int Mileage { get; set; }
        public string Color { get; set; } = string.Empty;
        public string Transmission { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
        public string BodyStyle { get; set; } = string.Empty;
        public string FuelType { get; set; } = string.Empty;
        public string Drivetrain { get; set; } = string.Empty;
        public string ExteriorColor { get; set; } = string.Empty;
        public string InteriorColor { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Features { get; set; } = string.Empty;
        public string ConditionReport { get; set; } = string.Empty;
        public bool IsAvailable { get; set; } = true;
    }

    public class UpdateVehicleRequest
    {
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public decimal Price { get; set; }
        public int Mileage { get; set; }
        public string Color { get; set; } = string.Empty;
        public string Transmission { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
        public string BodyStyle { get; set; } = string.Empty;
        public string FuelType { get; set; } = string.Empty;
        public string Drivetrain { get; set; } = string.Empty;
        public string ExteriorColor { get; set; } = string.Empty;
        public string InteriorColor { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Features { get; set; } = string.Empty;
        public string ConditionReport { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
    }

    public class PaginatedResponse<T>
    {
        public List<T> Data { get; set; } = new();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage { get; set; }
        public bool HasPreviousPage { get; set; }
    }
}
