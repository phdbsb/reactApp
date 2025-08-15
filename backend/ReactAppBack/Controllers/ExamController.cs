using System.Security.Claims;
using AutoMapper;
using DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactAppBack.Services;

namespace ReactAppBack.Controllers
{
    [ApiController]
    [Route("exams")]
    [Authorize]
    public class ExamController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IExamService _examService;

        public ExamController(IMapper mapper, IExamService examService)
        {
            _mapper = mapper;
            _examService = examService;
        }

        [HttpGet]
        [Authorize(Roles = "Professor, Student")]
        public async Task<ActionResult> GetExams()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                
                if (string.IsNullOrEmpty(userIdClaim))
                    return Unauthorized("User Id not found in token");
                
                if(!Guid.TryParse(userIdClaim, out var userId))
                    return Unauthorized("Invalid user ID in token.");
                
                var exams = await _examService.GetExams(userId);
                
                return Ok(exams);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("{id}")]
        [Authorize(Roles = "Professor, Student")]
        public async Task<ActionResult> GetExamById(Guid id)
        {
            try
            {
                var exam = await _examService.GetExamByIdAsync(id);
                var examDto = _mapper.Map<EditDTO>(exam);
                
                return Ok(examDto);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles = "Professor")]
        public async Task<ActionResult> AddExam([FromBody] ExamDTO exam)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("User Id not found in token");
                
            if(!Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized("Invalid user ID in token.");
            
            var result = await _examService.AddExamAsync(exam, userId);
            if (result == "Exam added!")
                return Ok(result);
            
            return BadRequest(result);
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize(Roles = "Professor")]
        public async Task<ActionResult> UpdateExam(Guid id, [FromBody] EditDTO exam)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("User Id not found in token");
                
            if(!Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized("Invalid user ID in token.");
            
            var result = await _examService.UpdateExamAsync(id, exam, userId);
            if (result == "Exam updated!") 
                return Ok(result);
            
            return BadRequest(result);
        }

        [HttpPut]
        [Route("{id}/archive")]
        [Authorize(Roles = "Professor")]
        public async Task<ActionResult> ArchiveExam(Guid id)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                    return Unauthorized("User Id not found in token");
                
                if(!Guid.TryParse(userIdClaim, out var userId))
                    return Unauthorized("Invalid user ID in token.");

                var result = await _examService.ArchiveExam(id, userId);
                if (result == "Exam archived!")
                    return Ok(result);
                
                return BadRequest(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Roles = "Professor")]
        public async Task<ActionResult> DeleteExam(Guid id)
        {
            var result = await _examService.DeleteExamAsync(id);
            if (result == "Exam deleted!")
                return Ok(result);
            return BadRequest(result);
        }
    }
}

