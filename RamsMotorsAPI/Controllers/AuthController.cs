using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RamsMotorsAPI.Data;
using RamsMotorsAPI.DTOs;
using RamsMotorsAPI.Models;
using RamsMotorsAPI.Services;

namespace RamsMotorsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly RamsMotorsDbContext _context;
        private readonly IJwtService _jwtService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(RamsMotorsDbContext context, IJwtService jwtService, ILogger<AuthController> logger)
        {
            _context = context;
            _jwtService = jwtService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
                {
                    return BadRequest(new { message = "Username and password are required" });
                }

                var user = await _context.AdminUsers
                    .FirstOrDefaultAsync(u => u.Username == request.Username && u.IsActive);

                if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                {
                    return Unauthorized(new { message = "Invalid username or password" });
                }

                // Update last login
                user.LastLogin = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                var token = _jwtService.GenerateToken(user);
                var expiresAt = DateTime.UtcNow.AddMinutes(1440); // 24 hours

                var response = new LoginResponse
                {
                    Token = token,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role,
                    ExpiresAt = expiresAt
                };

                _logger.LogInformation("User {Username} logged in successfully", user.Username);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for user {Username}", request.Username);
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }

        [HttpPost("register")]
        [Authorize(Roles = "admin")] // Only existing admins can create new admin users
        public async Task<ActionResult<LoginResponse>> Register([FromBody] CreateAdminUserRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password) || 
                    string.IsNullOrEmpty(request.Email))
                {
                    return BadRequest(new { message = "Username, email, and password are required" });
                }

                // Check if username or email already exists
                var existingUser = await _context.AdminUsers
                    .FirstOrDefaultAsync(u => u.Username == request.Username || u.Email == request.Email);

                if (existingUser != null)
                {
                    return Conflict(new { message = "Username or email already exists" });
                }

                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

                var newUser = new AdminUser
                {
                    Username = request.Username,
                    Email = request.Email,
                    PasswordHash = hashedPassword,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Role = request.Role,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.AdminUsers.Add(newUser);
                await _context.SaveChangesAsync();

                var token = _jwtService.GenerateToken(newUser);
                var expiresAt = DateTime.UtcNow.AddMinutes(1440); // 24 hours

                var response = new LoginResponse
                {
                    Token = token,
                    Username = newUser.Username,
                    Email = newUser.Email,
                    Role = newUser.Role,
                    ExpiresAt = expiresAt
                };

                _logger.LogInformation("New admin user {Username} created successfully", newUser.Username);
                return CreatedAtAction(nameof(Login), response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user registration for {Username}", request.Username);
                return StatusCode(500, new { message = "An error occurred during registration" });
            }
        }

        [HttpPost("validate")]
        [Authorize]
        public ActionResult ValidateToken()
        {
            // If we reach here, the token is valid (due to [Authorize] attribute)
            var username = User.Identity?.Name;
            var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            
            return Ok(new { 
                message = "Token is valid", 
                username = username,
                role = role 
            });
        }

        [HttpPost("logout")]
        [Authorize]
        public ActionResult Logout()
        {
            // In a stateless JWT system, logout is handled client-side by removing the token
            // This endpoint can be used for logging purposes
            var username = User.Identity?.Name;
            _logger.LogInformation("User {Username} logged out", username);
            
            return Ok(new { message = "Logged out successfully" });
        }
    }
}
