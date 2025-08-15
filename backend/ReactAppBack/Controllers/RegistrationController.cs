using System.Security.Claims;
using DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactAppBack.Services;

namespace ReactAppBack.Controllers
{
    [ApiController]
    [Route("registrations")]
    [Authorize]
    public class RegistrationController : ControllerBase
    {
        private readonly IRegistrationService _registrationService;

        public RegistrationController(IRegistrationService registrationService)
        {
            _registrationService = registrationService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetRegistration(Guid id)
        {
            var registration = await _registrationService.GetRegistrationByIdAsync(id);
            
            return Ok(registration);
        }

        [HttpGet("passed-status")]
        public async Task<ActionResult<bool>> GetRegistrationPassedStatus([FromQuery] Guid examId)
        {
            var studentIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(studentIdClaim))
                return Unauthorized("Student Id not found in token");
            
            if (!Guid.TryParse(studentIdClaim, out var studentId))
                return Unauthorized("Invalid student ID in token.");
            
            var passed = await _registrationService.IsExamPassed(studentId, examId);
            
            return Ok(passed);
        }
        
        [HttpGet("passed-exams")]
        public async Task<ActionResult<List<ExamPassedDto>>> GetPassedExams()
        {
            var studentIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(studentIdClaim))
                return Unauthorized("Student Id not found in token");

            if (!Guid.TryParse(studentIdClaim, out var studentId))
                return Unauthorized("Invalid student ID in token.");

            var passedExams = await _registrationService.GetPassedExams(studentId);
    
            return Ok(passedExams);
        }

        [HttpPost]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult> RegisterExam(RegistrationDto registrationDto)
        {
            try
            {
                var studentIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                
                if (string.IsNullOrEmpty(studentIdClaim))
                    return Unauthorized("Student Id not found in token");
                
                if (!Guid.TryParse(studentIdClaim, out var studentId))
                    return Unauthorized("Invalid student ID in token.");
                
                var registration = await _registrationService.RegisterExamAsync(studentId, registrationDto);
                return CreatedAtAction("GetRegistration", new { id = registration.ID }, registration);
            }
            catch (ArgumentException e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("status")]
        public async Task<ActionResult> UpdatePassedStatus([FromBody] UpdatePassedStatusDto updatePassedStatusDto)
        {
            try
            {
                var studentIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                
                if (string.IsNullOrEmpty(studentIdClaim))
                    return Unauthorized("Student Id not found in token");
                
                if (!Guid.TryParse(studentIdClaim, out var studentId))
                    return Unauthorized("Invalid student ID in token.");
                
                var result = await _registrationService.UpdatePassedStatus(studentId, updatePassedStatusDto);
                if (!result)
                    return NotFound("Registration not found");

                return Ok(new { message = "Passed status updated" });
            }
            catch (ArgumentException e)
            {
                return BadRequest(e.Message);
            }
           
        }
        
    }
}

