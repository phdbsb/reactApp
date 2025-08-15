using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("Registration")]
    public class Registration
    {
        [Key]
        public Guid ID { get; set; } = Guid.NewGuid();
        
        [Required]
        public bool Passed { get; set; }
        
        public User User { get; set; }
        public Exam Exam { get; set; }
        public Deadline Deadline { get; set; }
        
    }
}

