using Models;
using Microsoft.EntityFrameworkCore;
using DTOs;

namespace ReactAppBack.Services
{
    public interface IRegistrationService
    {
        Task<Registration> RegisterExamAsync(Guid userId, RegistrationDto registrationDto);
        Task<bool> IsExamPassed(Guid userId, Guid examId);
        Task<Registration> GetRegistrationByIdAsync(Guid id);
        Task<bool> UpdatePassedStatus(Guid userId, UpdatePassedStatusDto updatePassedStatusDto);
        Task<List<ExamPassedDto>> GetPassedExams(Guid userId);
    }
    
    public class RegistrationService : IRegistrationService
    {
        private readonly FacultyContext _context;

        public RegistrationService(FacultyContext context)
        {
            _context = context;
        }

        public async Task<Registration> GetRegistrationByIdAsync(Guid id)
        {
            var registration = await _context.Registrations
                .Include(r => r.User)
                .Include(r => r.Exam)
                .Include(r => r.Deadline)
                .FirstOrDefaultAsync(r => r.ID == id);
            if (registration == null)
            {
                throw new ArgumentException("No exam found!");
            }
            return registration;
        }

        public async Task<bool> IsExamPassed(Guid userId, Guid examId)
        {
            var registration = await _context.Registrations
                .Include(r => r.Deadline)
                .Where(r => r.User.ID == userId && r.Exam.ID == examId)
                .OrderByDescending(r => r.Deadline.DateTo)
                .FirstOrDefaultAsync();

            return registration?.Passed ?? false;
        }
        
        public async Task<Registration> RegisterExamAsync(Guid userId, RegistrationDto registrationDto)
        {
            var user = await _context.Users.FindAsync(userId);
            var exam = await _context.Exams.FindAsync(registrationDto.ExamId);
            var deadline = await _context.Deadlines.FindAsync(registrationDto.DeadlineId);

            if (user == null || exam == null || deadline == null)
            {
                throw new ArgumentException("User, Exam or Deadline not found");
            }

            var registration = new Registration
            {
                User = user,
                Exam = exam,
                Deadline = deadline,
                Passed = false
            };
            
            _context.Registrations.Add(registration);
            await _context.SaveChangesAsync();
            
            return registration;
        }

        public async Task<bool> UpdatePassedStatus(Guid userId, UpdatePassedStatusDto updatePassedStatusDto)
        {
            var registration = await _context.Registrations
                .Include(r => r.Deadline)
                .Where(r =>
                    r.User.ID == userId &&
                    r.Exam.ID == updatePassedStatusDto.ExamId)
                .OrderByDescending(r => r.Deadline.DateTo)
                .FirstOrDefaultAsync();
            
            if(registration == null)
                return false;
            
            registration.Passed = updatePassedStatusDto.Passed;
            await _context.SaveChangesAsync();
            return true;
        }
        
        public async Task<List<ExamPassedDto>> GetPassedExams(Guid userId)
        {
            var registrations = await _context.Registrations
                .Where(r => r.User.ID == userId && r.Passed == true)
                .Select(r => new ExamPassedDto
                {
                    ExamId = r.Exam.ID,
                    Passed = r.Passed
                })
                .ToListAsync();

            return registrations;
        }
    }
}

