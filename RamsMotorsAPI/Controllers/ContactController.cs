using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;

namespace RamsMotorsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {        [HttpPost("submit")]
        public IActionResult SubmitContactForm([FromBody] ContactFormDto contactForm)
        {
            try
            {
                // For now, we'll just return success
                // In a real implementation, you could:
                // 1. Save to database
                // 2. Send email via SMTP
                // 3. Integrate with email service like SendGrid

                // Validate the form data
                if (string.IsNullOrWhiteSpace(contactForm.Name) ||
                    string.IsNullOrWhiteSpace(contactForm.Email) ||
                    string.IsNullOrWhiteSpace(contactForm.Subject) ||
                    string.IsNullOrWhiteSpace(contactForm.Message))
                {
                    return BadRequest(new { message = "All required fields must be filled out." });
                }

                // Return success response
                return Ok(new { 
                    message = "Thank you for your message. We'll get back to you soon!",
                    success = true 
                });
            }
            catch (Exception ex)
            {
                // Log the error (you might want to use a proper logging framework)
                Console.WriteLine($"Contact form submission error: {ex.Message}");
                
                return StatusCode(500, new { 
                    message = "There was an error processing your request. Please try again later.",
                    success = false 
                });
            }
        }
    }

    public class ContactFormDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string VehicleInterest { get; set; } = string.Empty;
    }
}
