using System.Text.Json;
using AutoMapper;
using Models;
using Microsoft.EntityFrameworkCore;
using DTOs;

namespace ReactAppBack.Services
{
    public interface IExamService
    {
        Task<List<GetExamDTO>> GetExams(Guid userId);
        Task<Exam> GetExamByIdAsync(Guid id);
        Task<string> AddExamAsync(ExamDTO examDto, Guid userId);
        Task<string> UpdateExamAsync(Guid id, EditDTO examDto, Guid userId);
        Task<string> ArchiveExam(Guid id, Guid userId);
        Task<string> DeleteExamAsync(Guid id);
    }

    public class ExamService : IExamService
    {
        private readonly FacultyContext _context;
        private readonly IMapper _mapper;

        public ExamService(FacultyContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        
        public async Task<List<GetExamDTO>> GetExams(Guid userId)
        {
            try
            {
                var user = await _context.Users
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.ID == userId);
                
                if (user == null)
                    throw new Exception("User not found");

                var exams = await _context.Exams
                    .AsNoTracking()
                    .Where(e => !e.Archived)
                    .ToListAsync();

                if (!exams.Any()) 
                    return new List<GetExamDTO>();
        
                var registrations = await _context.Registrations
                    .AsNoTracking()
                    .Where(r => r.User.ID == userId)
                    .Include(r => r.Deadline)
                    .Include(r => r.Exam)
                    .ToListAsync();
                
                var latestRegistrations = registrations
                    .GroupBy(r => r.Exam?.ID)
                    .Select(g => g.OrderByDescending(r => r.Deadline?.DateTo).FirstOrDefault())
                    .Where(r => r != null)
                    .ToList();
        
                var deadlineIds = latestRegistrations
                    .Where(r => r.Deadline != null)
                    .Select(r => r.Deadline.ID)
                    .Distinct()
                    .ToList();

                var deadlines = await _context.Deadlines
                    .AsNoTracking()
                    .Where(d => deadlineIds.Contains(d.ID))
                    .ToListAsync();

                var retExams = exams.Select(exam =>
                {
                    var registration = latestRegistrations.FirstOrDefault(r => r.Exam?.ID == exam.ID);
                    DateTime? examDate = null;

                    if (registration?.Deadline != null)
                    {
                        var termDates = JsonSerializer.Deserialize<Dictionary<string, DateTime>>(exam.Term)
                                    ?? new Dictionary<string, DateTime>();
                
                        var deadline = deadlines.FirstOrDefault(d => d.ID == registration.Deadline.ID);
                        if (deadline != null && termDates.ContainsKey(deadline.Name))
                        {
                            examDate = termDates[deadline.Name];
                        }
                    }
                    
                    return new GetExamDTO()
                    {
                        ID = exam.ID,
                        Title = exam.Title,
                        Semester = exam.Semester,
                        Schedule = exam.TermData,
                        Term = examDate,
                        IsRegistered = registration != null,
                    };
                }).ToList();
                
                return retExams;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex}");
                throw new Exception("Error getting exams.");
            }
        }

        public async Task<Exam> GetExamByIdAsync(Guid id)
        {
            var exam = await _context.Exams.FindAsync(id);
            if (exam == null)
            {
                throw new ArgumentException("No exam found!");
            }
            return exam;
        }

        public async Task<string> AddExamAsync(ExamDTO examDto, Guid userId)
        {
            if (string.IsNullOrWhiteSpace(examDto.Title) || examDto.Title.Length > 50)
            {
                return "Exam title is invalid";
            }

            if (examDto.Semester < 1 || examDto.Semester > 2)
            {
                return "Semester is invalid";
            }

            try
            {
                var user = await _context.Users
                    .Include(s => s.Exams)
                    .FirstOrDefaultAsync(s => s.ID == userId);
                
                if (user == null)
                    return "User not found";
                if (user.Role != UserRole.Professor)
                    return "Unauthorized, only professors can update exams";
                
                var dboExam = _mapper.Map<Exam>(examDto);
                
                // var dboExam = new Exam
                // {
                //     Title = examDto.Title,
                //     Semester = examDto.Semester,
                //     TermData = examDto.Schedule
                // };
                dboExam.Users.Add(user);
                
                _context.Exams.Add(dboExam);
                await _context.SaveChangesAsync();
                
                return "Exam added!";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }

        public async Task<string> UpdateExamAsync(Guid id, EditDTO examDto, Guid userId)
        {
            try
            {
                var examToUpdate = await _context.Exams
                    .Include(e => e.Users)
                    .FirstOrDefaultAsync(e => e.ID == id);
                
                if (examToUpdate == null)
                    return "Exam not found";
                
                _mapper.Map(examDto, examToUpdate);
                
                // examToUpdate.Title = examDto.Title;
                // examToUpdate.Semester = examDto.Semester;
                // examToUpdate.TermData = examDto.Schedule;
                
                await _context.SaveChangesAsync();
                return "Exam updated!";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }

        public async Task<string> ArchiveExam(Guid id, Guid userId)
        {
            var examToArchive = await _context.Exams.FindAsync(id);
            if (examToArchive == null)
                return "Exam not found";
            
            examToArchive.Archived = true;
            await _context.SaveChangesAsync();
            return "Exam archived!";
        }
        public async Task<string> DeleteExamAsync(Guid id)
        {
            try
            {
                var examToDelete = await _context.Exams.FindAsync(id);
                if (examToDelete == null) return "Exam not found";

                _context.Exams.Remove(examToDelete);
                await _context.SaveChangesAsync();
                return "Exam deleted!";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }
    }
}

