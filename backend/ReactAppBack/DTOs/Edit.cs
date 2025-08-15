namespace DTOs
{
    public class EditDTO
    {
        public Guid ID { get; set; }
        public string Title { get; set; }
        public int Semester { get; set; }
        public Dictionary<string, DateTime> Schedule { get; set; }
    }
}

