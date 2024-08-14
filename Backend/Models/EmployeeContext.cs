using Microsoft.EntityFrameworkCore;

public class EmployeeContext : DbContext
{
    public DbSet<Employee> Employees { get; set; }

    public EmployeeContext(DbContextOptions<EmployeeContext> options) : base(options) { }
}

public class Employee
{
    public string email_id { get; set; }
    public string name { get; set; }
    public string country { get; set; }
    public string state { get; set; }
    public string city { get; set; }
    public string telephone_number { get; set; }
    public string address_line_1 { get; set; }
    public string address_line_2 { get; set; }
    public string date_of_birth { get; set; }
    public string gross_salary_FY2019_20 { get; set; }
    public string gross_salary_FY2020_21 { get; set; }
    public string gross_salary_FY2021_22 { get; set; }
    public string gross_salary_FY2022_23 { get; set; }
    public string gross_salary_FY2023_24 { get; set; }
}
