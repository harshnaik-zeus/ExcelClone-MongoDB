using System;
using System.Data;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api")]
    public class FindandReplaceController : ControllerBase
    {
        private readonly string _connectionString;

        public FindandReplaceController()
        {
            _connectionString =
                "Server=localhost;User ID=root;Password=Interstellar@2014;Database=employeedb";
        }

        public class FindAndReplaceRequest
        {
            public string? FindText { get; set; }
            public string? ReplaceText { get; set; }
        }

        [HttpPost("FindandReplace")]
        public async Task<ActionResult> FindandReplace([FromBody] FindAndReplaceRequest request)
        {
            if (
                request == null
                || string.IsNullOrEmpty(request.FindText)
                || string.IsNullOrEmpty(request.ReplaceText)
            )
            {
                return BadRequest(new { message = "findText and replaceText are required." });
            }

            using var connection = new MySqlConnection(_connectionString);
            try
            {
                await connection.OpenAsync();

                var columns = new[]
                {
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "11",
                    "12",
                    "13",
                    "14",
                    "15",
                };

                var setClauses = string.Join(
                    ", ",
                    columns.Select(column =>
                        $"`{column}` = REPLACE(`{column}`, @FindText, @ReplaceText)"
                    )
                );
                var query =
                    $"UPDATE employeeinfo SET {setClauses} WHERE {string.Join(" OR ", columns.Select(column => $"`{column}` LIKE CONCAT('%', @FindText, '%')"))}";

                var command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@FindText", request.FindText);
                command.Parameters.AddWithValue("@ReplaceText", request.ReplaceText);

                var totalRowsAffected = await command.ExecuteNonQueryAsync();

                return Ok(new { Status = true, TotalRowsAffected = totalRowsAffected });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            finally
            {
                if (connection.State == ConnectionState.Open)
                {
                    await connection.CloseAsync();
                }
            }
        }
    }
}
