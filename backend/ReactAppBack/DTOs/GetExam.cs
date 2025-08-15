namespace DTOs
{
    public class GetExamDTO
    {
        public Guid ID { get; set; }
        public string Title { get; set; }
        public int Semester { get; set; }
        public Dictionary<string, DateTime> Schedule { get; set; }
        public DateTime? Term { get; set; }
        public bool IsRegistered { get; set; }
    }
}