namespace DTOs
{
    public class StudentRegistrationDto
    {
        public Guid UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? Grade { get; set; }
    }
}

