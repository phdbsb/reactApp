using System.Security.Claims;
using DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactAppBack.Services;

namespace ReactAppBack.Controllers
{
    [ApiController]
    [Route("images")]
    public class ImageController : ControllerBase
    {
        private readonly IImageService _imageService;
        
        public ImageController(IImageService imageService)
        {
            _imageService = imageService;
        }
        
        [HttpGet]
        [Authorize(Roles = "Admin, Professor, Student")]
        public IActionResult GetUserImage([FromQuery] string? imagePath)
        {
            try
            {
                if (imagePath == null)
                    return NoContent();
                
                var result = _imageService.GetImage(imagePath);
                if (result == null)
                    return NoContent();
                
                return result;
            }
            catch (Exception ex)
            {
                return BadRequest($"Error loading image: {ex.Message}");
            }
        }
        
        [HttpPost("get-images")]
        [Authorize(Roles = "Admin, Professor, Student")]
        public async Task<IActionResult> GetImages([FromBody] List<ImageRequestDto> requests)
        {
            try
            {
                var images = await _imageService.GetImages(requests);
                return Ok(images);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error retrieving images: {ex.Message}");
            }
        }
        
        
        [HttpPost("upload-image")]
        [Authorize(Roles = "Professor, Student")]
        public async Task<IActionResult> UploadAvatar([FromForm] ImageUploadDto imageDto)
        {
            var image = imageDto.Image;
            
            if (image.Length == 0)
                return BadRequest("No image uploaded");
            
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("User ID not found in token");
        
            if (!Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized("Invalid user ID in token");
        
            try
            {
                var imagePath = await _imageService.UploadImage(image, userId);
                return Ok(new {imagePath});
            }
            catch (Exception ex)
            {
                return BadRequest($"Error uploading image: {ex.Message}");
            }
        }
        
        [HttpDelete("delete-image")]
        [Authorize(Roles = "Professor, Student")]
        public async Task<IActionResult> DeleteImage()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("User ID not found in token");
            
            if (!Guid.TryParse(userIdClaim, out var userId))
                
                return Unauthorized("Invalid user ID in token");
            
            try
            {
                await _imageService.DeleteImage(userId);
                return Ok(new { message = "Profile image deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error deleting image: {ex.Message}");
            }
        }
    }
}

