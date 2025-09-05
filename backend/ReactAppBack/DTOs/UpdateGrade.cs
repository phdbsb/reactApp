namespace DTOs
{
    public class UpdateGradeDto
    {
        public Guid UserId { get; set; }
        public Guid ExamId { get; set; }
        public int Grade { get; set; }
    }
}