using AutoMapper;
using DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Models;
using Microsoft.EntityFrameworkCore;
namespace ReactAppBack.Services
{
    public interface IUserService
    {
        Task<List<UserDisplayDto>> GetAllUsers(Guid userId);
        Task<List<ImageRequestDto>> GetAllUsersIdImage();
        Task UpdateUsersRoles(Dictionary<Guid, string> userRoles);
        Task<RegLogUser> UpdateUserInfo(Guid userId, UserInfoUpdateDto userInfo);
    }
    
    public class UserService : IUserService
    {
        private readonly FacultyContext _context;
        private readonly IMapper _mapper;

        public UserService(FacultyContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<UserDisplayDto>> GetAllUsers(Guid userId)
        {
            return await _context.Users
                .Where(u => u.Role != UserRole.Admin && u.ID != userId)
                .OrderBy(u => u.Role)
                .ThenBy(u => u.LastName)
                .Select(u => new UserDisplayDto
                {
                    UserId = u.ID,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    Role = u.Role.ToString(),
                    ImagePath = u.ImagePath
                }).ToListAsync();
        }

        public async Task<List<ImageRequestDto>> GetAllUsersIdImage()
        {
            return await _context.Users
                .Where(u => u.Role != UserRole.Admin)
                .Select(u => new ImageRequestDto
                {
                    UserId = u.ID,
                    ImagePath = u.ImagePath
                }).ToListAsync();
        }

        public async Task UpdateUsersRoles(Dictionary<Guid, string> userRoles)
        {
            var userIds = userRoles.Keys.ToList();
            var users = await _context.Users.Where(u => userIds.Contains(u.ID)).ToListAsync();

            foreach (var user in users)
            {
                if (userRoles.TryGetValue(user.ID, out var newRoleStr))
                {
                    if (Enum.TryParse<UserRole>(newRoleStr, true, out var newRole))
                    {
                        user.Role = newRole;
                    }
                    else
                    {
                        throw new ApplicationException($"Invalid role value '{newRoleStr}' for user {user.ID}");
                    }
                }
            }
            await _context.SaveChangesAsync();
        }

        public async Task<RegLogUser> UpdateUserInfo(Guid userId, UserInfoUpdateDto userInfo)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ID == userId);
            if (user == null)
                throw new Exception("User not found");
            
            user.FirstName = userInfo.FirstName;
            user.LastName = userInfo.LastName;
            
            await _context.SaveChangesAsync();
            
            return _mapper.Map<RegLogUser>(user);
        }
        
        
    }
}

