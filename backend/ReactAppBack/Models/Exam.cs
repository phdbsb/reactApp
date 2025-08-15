using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace Models
{
    [Table("Exam")]
    public class Exam
    {
        [Key]
        public Guid ID { get; set; } = Guid.NewGuid();
        
        [Required]
        [MaxLength(50)]
        public string Title { get; set; }
        
        [Required]
        [Range(1, 2)]
        public int Semester { get; set; }
        
        [Required]
        [Column(TypeName = "jsonb")]
        public string Term { get; set; }
        
        [NotMapped]
        public Dictionary<string, DateTime> TermData
        {
            get => string.IsNullOrEmpty(Term) ? new Dictionary<string, DateTime>()
                : JsonSerializer.Deserialize<Dictionary<string, DateTime>>(Term) ?? new Dictionary<string, DateTime>();
            set => Term = JsonSerializer.Serialize(value);
        }
        
        public bool Archived { get; set; } = false;
        
        public List<Registration> Registrations { get; set; } = new List<Registration>();
        public List<User> Users { get; set; } = new List<User>();
        
    }
}

