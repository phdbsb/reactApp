namespace DTOs
{
    public class DeadlineDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
    }
}