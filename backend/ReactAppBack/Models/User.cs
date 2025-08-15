using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("User")]
    public class User
    {
        [Key]
        public Guid ID { get; set; } = Guid.NewGuid();
        
        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string LastName { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        [MinLength(8)]
        public string Password { get; set; }

        [Required] 
        public UserRole Role { get; set; } = UserRole.Student;
        
        [MaxLength(255)]
        public string? ImagePath { get; set; }
        public List<Registration> Registrations { get; set; } = new List<Registration>();
        public List<Exam> Exams { get; set; } = new List<Exam>();
    }
}

