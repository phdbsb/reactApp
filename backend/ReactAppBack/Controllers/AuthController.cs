using System.Security.Claims;
using AutoMapper;
using DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactAppBack.Services;

namespace ReactAppBack.Controllers
{
    [ApiController]
    [Route("auth")]
    
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IMapper _mapper;
        
        public AuthController(IAuthService userService, IMapper mapper)
        {
            _authService = userService;
            _mapper = mapper;
        }
        
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterUserDto registerUserDto)
        {
            try
            {
                var (user, token) = await _authService.RegisterUser(registerUserDto);
                
                var userDto = _mapper.Map<RegLogUser>(user);
                
                HttpContext.Response.Cookies.Append("jwt", token, new CookieOptions
                {
                    HttpOnly = true,
                    // Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddMinutes(60)
                });
                
                return Ok(userDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginDto loginDto)
        {
            try
            {
                var (token, user) = await _authService.Login(loginDto);

                var userDto = _mapper.Map<RegLogUser>(user);
                
                HttpContext.Response.Cookies.Append("jwt", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.UtcNow.AddMinutes(60),
                });
                
                return Ok(userDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");
            return Ok(new { message = "Logout successful." });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult> GetCurrentUser()
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                
                if(string.IsNullOrEmpty(email)) 
                    return Unauthorized();
                
                var user = await _authService.GetCurrentUser(email);
                
                var userDto = _mapper.Map<RegLogUser>(user);
                
                return Ok(userDto);
                
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

