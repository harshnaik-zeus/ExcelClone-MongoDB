using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    public partial class EmployeedbContext : DbContext
    {
        public EmployeedbContext(DbContextOptions<EmployeedbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Employee> Employees { get; set; }  // Corrected DbSet name

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.HasNoKey();  // Assuming your table has no primary key
                entity.ToTable("exceldata");

                entity.Property(e => e.AddressLine1).HasColumnName("address_line_1");
                entity.Property(e => e.AddressLine2).HasColumnName("address_line_2");
                entity.Property(e => e.City).HasColumnName("city");
                entity.Property(e => e.Country).HasColumnName("country");
                entity.Property(e => e.DateOfBirth).HasColumnName("date_of_birth");
                entity.Property(e => e.EmailId).HasColumnName("email_id");
                entity.Property(e => e.GrossSalaryFy201920).HasColumnName("gross_salary_FY2019_20");
                entity.Property(e => e.GrossSalaryFy202021).HasColumnName("gross_salary_FY2020_21");
                entity.Property(e => e.GrossSalaryFy202122).HasColumnName("gross_salary_FY2021_22");
                entity.Property(e => e.GrossSalaryFy202223).HasColumnName("gross_salary_FY2022_23");
                entity.Property(e => e.GrossSalaryFy202324).HasColumnName("gross_salary_FY2023_24");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.State).HasColumnName("state");
                entity.Property(e => e.TelephoneNumber).HasColumnName("telephone_number");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
