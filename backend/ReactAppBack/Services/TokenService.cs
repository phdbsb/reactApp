using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Models;

namespace ReactAppBack.Services
{
    public interface ITokenService
    {
        string GenerateToken(string email);
    }

    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;
        private readonly FacultyContext _context;
        
        public TokenService(IConfiguration configuration, FacultyContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        public string GenerateToken(string email)
        {
            var user = _context.Users.FirstOrDefault(x => x.Email == email);
            if(user == null)
                throw new Exception("Student not found");

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.FirstName),
                new Claim(ClaimTypes.Surname, user.LastName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.ID.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };
            
            var keyString = _configuration["JwtSettings:Key"];
            
            if (string.IsNullOrEmpty(keyString)) 
                throw new Exception("JWT key is missing from configuration.");
            
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
               
            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials
            );
            
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}