using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Exceldatum
{
    public string? EmailId { get; set; }

    public string? Name { get; set; }

    public string? Country { get; set; }

    public string? State { get; set; }

    public string? City { get; set; }

    public string? TelephoneNumber { get; set; }

    public string? AddressLine1 { get; set; }

    public string? AddressLine2 { get; set; }

    public string? DateOfBirth { get; set; }

    public int? GrossSalaryFy201920 { get; set; }

    public int? GrossSalaryFy202021 { get; set; }

    public int? GrossSalaryFy202122 { get; set; }

    public int? GrossSalaryFy202223 { get; set; }

    public int? GrossSalaryFy202324 { get; set; }
}
