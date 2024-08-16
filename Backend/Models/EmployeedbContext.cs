using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace Backend.Models;

public partial class EmployeedbContext : DbContext
{
    public EmployeedbContext()
    {
    }

    public EmployeedbContext(DbContextOptions<EmployeedbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Employeeinfo> Employeeinfos { get; set; }

    public virtual DbSet<Exceldatum> Exceldata { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;database=employeedb;user id=harsh.naik;password=password", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.37-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Employeeinfo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("employeeinfo");

            entity.HasIndex(e => e.Id, "ID_UNIQUE").IsUnique();

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e._1)
                .HasMaxLength(45)
                .HasColumnName("1");
            entity.Property(e => e._10)
                .HasMaxLength(45)
                .HasColumnName("10");
            entity.Property(e => e._11)
                .HasMaxLength(45)
                .HasColumnName("11");
            entity.Property(e => e._12)
                .HasMaxLength(45)
                .HasColumnName("12");
            entity.Property(e => e._13)
                .HasMaxLength(45)
                .HasColumnName("13");
            entity.Property(e => e._14)
                .HasMaxLength(45)
                .HasColumnName("14");
            entity.Property(e => e._2)
                .HasMaxLength(45)
                .HasColumnName("2");
            entity.Property(e => e._3)
                .HasMaxLength(45)
                .HasColumnName("3");
            entity.Property(e => e._4)
                .HasMaxLength(45)
                .HasColumnName("4");
            entity.Property(e => e._5)
                .HasMaxLength(45)
                .HasColumnName("5");
            entity.Property(e => e._6)
                .HasMaxLength(45)
                .HasColumnName("6");
            entity.Property(e => e._7)
                .HasMaxLength(45)
                .HasColumnName("7");
            entity.Property(e => e._8)
                .HasMaxLength(45)
                .HasColumnName("8");
            entity.Property(e => e._9)
                .HasMaxLength(45)
                .HasColumnName("9");
        });

        modelBuilder.Entity<Exceldatum>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("exceldata");

            entity.Property(e => e.AddressLine1)
                .HasColumnType("text")
                .HasColumnName("address_line_1");
            entity.Property(e => e.AddressLine2)
                .HasColumnType("text")
                .HasColumnName("address_line_2");
            entity.Property(e => e.City)
                .HasColumnType("text")
                .HasColumnName("city");
            entity.Property(e => e.Country)
                .HasColumnType("text")
                .HasColumnName("country");
            entity.Property(e => e.DateOfBirth)
                .HasColumnType("text")
                .HasColumnName("date_of_birth");
            entity.Property(e => e.EmailId)
                .HasColumnType("text")
                .HasColumnName("email_id");
            entity.Property(e => e.GrossSalaryFy201920).HasColumnName("gross_salary_FY2019_20");
            entity.Property(e => e.GrossSalaryFy202021).HasColumnName("gross_salary_FY2020_21");
            entity.Property(e => e.GrossSalaryFy202122).HasColumnName("gross_salary_FY2021_22");
            entity.Property(e => e.GrossSalaryFy202223).HasColumnName("gross_salary_FY2022_23");
            entity.Property(e => e.GrossSalaryFy202324).HasColumnName("gross_salary_FY2023_24");
            entity.Property(e => e.Name)
                .HasColumnType("text")
                .HasColumnName("name");
            entity.Property(e => e.State)
                .HasColumnType("text")
                .HasColumnName("state");
            entity.Property(e => e.TelephoneNumber)
                .HasColumnType("text")
                .HasColumnName("telephone_number");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
