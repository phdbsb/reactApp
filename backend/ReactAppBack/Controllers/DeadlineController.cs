using DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models;
using ReactAppBack.Services;

namespace ReactAppBack.Controllers
{
    [ApiController]
    [Route("deadlines")]
    [Authorize]
    public class DeadlineController : ControllerBase
    {
        private readonly IDeadlineService _deadlineService;

        public DeadlineController(IDeadlineService deadlineService)
        {
            _deadlineService = deadlineService;
        }
        
        [HttpGet]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<IEnumerable<DeadlineDto>>> GetDeadlines()
        {
            try
            {
               var deadlines = await _deadlineService.GetDeadlines();
               if (deadlines.Count == 0)
                   return NotFound("No deadlines found");
               
               return Ok(deadlines);
               
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{examId}")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult> GetDeadlineByExamId(Guid examId)
        {
            try
            {
                var deadlines = await _deadlineService.GetExamDeadlines(examId);
                return Ok(deadlines);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles = "Professor")]
        public async Task<ActionResult> AddDeadline([FromBody] DeadlineDto deadlineDto)
        {
            var result = await _deadlineService.AddDeadline(deadlineDto);
            if (result == "Deadline added")
                return Ok(result);
            return BadRequest(result);
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize(Roles = "Professor")]
        public async Task<ActionResult> UpdateDeadline(Guid id, [FromBody] Deadline deadline)
        {
            var result = await _deadlineService.UpdateDeadline(id, deadline);
            if (result == "Deadline updated")
                return Ok(result);
            return BadRequest(result);
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Roles = "Professor")]
        public async Task<ActionResult> DeleteDeadline(Guid id)
        {
            var result = await _deadlineService.DeleteDeadline(id);
            if (result == "Deadline deleted")
                return Ok(result);
            return BadRequest(result);
        }
    }
}