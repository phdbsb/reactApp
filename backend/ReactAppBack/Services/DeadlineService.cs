using System.Text.Json;
using AutoMapper;
using DTOs;
using Microsoft.EntityFrameworkCore;
using Models;

namespace ReactAppBack.Services
{
    public interface IDeadlineService
    {
        Task<List<DeadlineDto>> GetDeadlines();
        Task<List<DeadlineTermDto>> GetExamDeadlines(Guid examId);
        Task<string> AddDeadline(DeadlineDto deadlineDto);
        Task<string> UpdateDeadline(Guid id, Deadline deadline);
        Task<string> DeleteDeadline(Guid id);
    }

    public class DeadlineService : IDeadlineService
    {
        private readonly FacultyContext _context;
        private readonly IMapper _mapper;

        public DeadlineService(FacultyContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<DeadlineDto>> GetDeadlines()
        {
            try
            {
                var deadlines = await _context.Deadlines.ToListAsync();

                var deadlinesDto = _mapper.Map<List<DeadlineDto>>(deadlines);
                // var deadlines = await _context.Deadlines
                //     .Select(d => new DeadlineDto
                //     {
                //         Id = d.ID,
                //         Name = d.Name,
                //         DateFrom = d.DateFrom,
                //         DateTo = d.DateTo
                //     }).ToListAsync();
                return deadlinesDto.Count == 0 ? new List<DeadlineDto>() : deadlinesDto;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<string> AddDeadline(DeadlineDto deadlineDto)
        {
            if (string.IsNullOrEmpty(deadlineDto.Name) || deadlineDto.Name.Length > 50)
            {
                return "Deadline name is invalid";
            }

            if (deadlineDto.DateFrom >= deadlineDto.DateTo)
            {
                return "Invalid date range";
            }

            try
            {
                var newDeadline = new Deadline
                {
                    Name = deadlineDto.Name,
                    DateFrom = deadlineDto.DateFrom,
                    DateTo = deadlineDto.DateTo
                };
                _context.Deadlines.Add(newDeadline);
                await _context.SaveChangesAsync();
                return "Deadline added";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }
        
        public async Task<List<DeadlineTermDto>> GetExamDeadlines(Guid examId)
        {
            try
            {
                var exam = await _context.Exams
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.ID == examId);
                
                if (exam == null) 
                    return new List<DeadlineTermDto>();

                var termDates = JsonSerializer.Deserialize<Dictionary<string, DateTime>>(exam.Term)
                                ??  new Dictionary<string, DateTime>();
                
                var deadlines = await _context.Deadlines
                    .AsNoTracking()
                    .ToListAsync();
                
                var filteredDeadlines = deadlines
                    .Where(d => termDates.ContainsKey(d.Name))
                    .Select(d => new DeadlineTermDto
                    {
                        Id = d.ID,
                        Name = d.Name,
                        DateFrom = d.DateFrom,
                        DateTo = d.DateTo,
                        ExamDate = termDates[d.Name]
                    })
                    .ToList();
                
                return filteredDeadlines;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<string> UpdateDeadline(Guid id, Deadline deadline)
        {
            try
            {
                var deadlineToUpdate = await _context.Deadlines.FindAsync(id);
                if (deadlineToUpdate == null) return "Deadline not found!";

                deadlineToUpdate.Name = deadline.Name;
                deadlineToUpdate.DateFrom = deadline.DateFrom;
                deadlineToUpdate.DateTo = deadline.DateTo;

                await _context.SaveChangesAsync();
                return "Deadline updated!";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }

        public async Task<string> DeleteDeadline(Guid id)
        {
            try
            {
                var deadlineToDelete = await _context.Deadlines.FindAsync(id);
                if (deadlineToDelete == null) return "Deadline not found";

                _context.Deadlines.Remove(deadlineToDelete);
                await _context.SaveChangesAsync();
                return "Deadline deleted!";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }
    }
}

