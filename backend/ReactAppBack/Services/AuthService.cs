using DTOs;
using Models;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace ReactAppBack.Services
{
    public interface IAuthService
    {
        Task<(User User, string Token)> RegisterUser(RegisterUserDto userDto);
        Task<(string Token, User User)> Login(LoginDto loginDto);
        Task<User> GetCurrentUser(string email);
    }

    public class AuthService : IAuthService
    {
        private readonly FacultyContext _context;
        private readonly ITokenService _tokenService;

        public AuthService(FacultyContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        public async Task<(User User, string Token)> RegisterUser(RegisterUserDto userDto)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(s => s.Email == userDto.Email);

            if (existingUser != null)
                throw new Exception("Email already exists");
            
            var emailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
            if(!emailRegex.IsMatch(userDto.Email))
                throw new Exception("Email is not valid");
            
            if (string.IsNullOrWhiteSpace(userDto.Password) || userDto.Password.Length < 8) 
                throw new Exception("Password must have minimum 8 characters");

            var user = new User
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password),
                Role = UserRole.Student
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _tokenService.GenerateToken(user.Email);
            return (user, token);
        }

        public async Task<(string Token, User User)> Login(LoginDto loginDto)
        {
            if (string.IsNullOrWhiteSpace(loginDto.Email) || string.IsNullOrWhiteSpace(loginDto.Password))
                throw new Exception("Email and password are required");
                
            var user = await _context.Users.FirstOrDefaultAsync(s => s.Email == loginDto.Email);
            if (user == null)
                throw new Exception("Invalid email or password");
            
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password);
            if (!isPasswordValid)
                throw new Exception("Invalid password");

            var token = _tokenService.GenerateToken(user.Email);
            return (token, user);
        }

        public async Task<User> GetCurrentUser(string email)
        {
            if(string.IsNullOrWhiteSpace(email))
                throw new Exception("Email is required");
            
            var user = await _context.Users.FirstOrDefaultAsync(s => s.Email == email);
            
            if(user == null)
                throw new Exception("User not found");
            
            return user;
        }
    }
}