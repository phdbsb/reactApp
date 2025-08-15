using AutoMapper;
using DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Models;

namespace ReactAppBack.Services
{
    public interface IImageService
    {
        FileStreamResult? GetImage(string imagePath);
        Task<List<ImageResponseDto>> GetImages(List<ImageRequestDto> requests);
        Task<string> UploadImage(IFormFile file, Guid userId);
        Task DeleteImage(Guid userId);
    }

    public class ImageService : IImageService
    {
        private readonly FacultyContext _context;
        private readonly IMapper _mapper;

        public ImageService(FacultyContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public FileStreamResult? GetImage(string imagePath)
        {
            if (string.IsNullOrEmpty(imagePath))
                return null;
            
            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), imagePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
            if (!System.IO.File.Exists(fullPath))
                return null;
        
            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(fullPath, out var contentType))
            {
                contentType = "application/octet-stream";
            }
        
            var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
            return new FileStreamResult(stream, contentType);
        }
        
        public async Task<List<ImageResponseDto>> GetImages(List<ImageRequestDto> requests)
        {
            var results = new List<ImageResponseDto>();

            foreach (var req in requests)
            {
                if (string.IsNullOrEmpty(req.ImagePath))
                {
                    results.Add(new ImageResponseDto
                    {
                        UserId = req.UserId,
                        ImageData = null
                    });
                    continue;
                }

                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), req.ImagePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));

                if (!File.Exists(fullPath))
                    continue;

                var imageBytes = await File.ReadAllBytesAsync(fullPath);

                results.Add(new ImageResponseDto
                {
                    UserId = req.UserId,
                    ImageData = imageBytes
                });
            }
            
            return results;
        }
        
        public async Task<string> UploadImage(IFormFile file, Guid userId)
        {
            if (file.Length == 0)
                throw new ArgumentException("Invalid file");
            
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "assets", "images", "user_images");
            
            if(!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);
            
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ID == userId);
            if (user == null)
                throw new Exception("User not found");

            if (!string.IsNullOrEmpty(user.ImagePath))
            {
                var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), user.ImagePath.TrimStart('/'));
                if (File.Exists(oldImagePath))
                {
                    File.Delete(oldImagePath);
                }
            }
        
            var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
            var fullPath = Path.Combine(folderPath, fileName);
        
            await using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            
            user.ImagePath = $"/assets/images/user_images/{fileName}";
            
            await _context.SaveChangesAsync();
            return user.ImagePath;
        }
        
        public async Task DeleteImage(Guid userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ID == userId);
            if (user == null)
                throw new Exception("User not found");

            if (!string.IsNullOrEmpty(user.ImagePath))
            {
                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), user.ImagePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                }
                user.ImagePath = null;
                await _context.SaveChangesAsync();
            }
        }
    }
}

