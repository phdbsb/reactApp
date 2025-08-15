using Models;

namespace DTOs
{
    public class RegLogUser
    {
        public Guid ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string? ImagePath { get; set; }
    }
}

