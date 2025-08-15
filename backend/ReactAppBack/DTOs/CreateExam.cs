namespace DTOs
{
    public class ExamDTO
    {
        public string Title { get; set; }
        public int Semester { get; set; }
        public Dictionary<string, DateTime> Schedule { get; set; }
    }
}

