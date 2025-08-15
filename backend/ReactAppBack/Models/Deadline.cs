using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("Deadline")]
    public class Deadline
    {
        [Key]
        public Guid ID { get; set; } = Guid.NewGuid();
        
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }
        
        [Required]
        public DateTime DateFrom { get; set; }
        
        [Required]
        public DateTime DateTo { get; set; }
        
        public List<Registration> Registrations { get; set; } = new List<Registration>();
    }
}