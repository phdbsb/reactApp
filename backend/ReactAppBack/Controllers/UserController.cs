using System.Security.Claims;
using DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactAppBack.Services;

namespace ReactAppBack.Controllers
{
    [ApiController]
    [Route("users")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("User ID not found in token");

            if (!Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized("Invalid user ID in token");
            
            var users = await _userService.GetAllUsers(userId);
            
            return Ok(users);
        }

        [HttpGet("id-images")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsersIdImages()
        {
            var userIdImage = await _userService.GetAllUsersIdImage();
            return Ok(userIdImage);
        }

        [HttpPut("update-role")]
        [Authorize(Roles = "Admin, Professor, Student")]
        public async Task<IActionResult> UpdateRoles([FromBody] Dictionary<Guid, string> roles)
        {
            try
            {
                await _userService.UpdateUsersRoles(roles);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error updating roles: {ex.Message}");
            }
        }

        [HttpPut("update-info")]
        [Authorize(Roles = "Professor, Student")]
        public async Task<IActionResult> UpdateUserInfo([FromBody] UserInfoUpdateDto userInfo)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized("Invalid user ID in token");

            try
            {
                var updateUser = await _userService.UpdateUserInfo(userId, userInfo);
                return Ok(updateUser);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error updating user info: {ex.Message}");
            }
        }
    }
}

