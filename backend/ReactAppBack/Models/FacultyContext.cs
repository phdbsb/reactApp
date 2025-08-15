using Microsoft.EntityFrameworkCore;

namespace Models
{
    public class FacultyContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Exam> Exams { get; set; }
        public DbSet<Deadline> Deadlines { get; set; }
        public DbSet<Registration> Registrations { get; set; }

        public FacultyContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Registration>()
                .HasOne(r => r.User)
                .WithMany(s => s.Registrations)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Registration>()
                .HasOne(r => r.Deadline)
                .WithMany(d => d.Registrations)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Registration>()
                .HasOne(r => r.Exam)
                .WithMany(e => e.Registrations)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasMany(s => s.Exams)
                .WithMany(e => e.Users)
                .UsingEntity<Dictionary<string, object>>(
                    "UserExam",
                    se => se.HasOne<Exam>().WithMany().HasForeignKey("ExamId").OnDelete(DeleteBehavior.Restrict),
                    se => se.HasOne<User>().WithMany().HasForeignKey("UserId").OnDelete(DeleteBehavior.Restrict)
                );
        }
    }
}

