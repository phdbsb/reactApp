namespace DTOs
{
    public class DeadlineTermDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public DateTime ExamDate { get; set; }
    }
}