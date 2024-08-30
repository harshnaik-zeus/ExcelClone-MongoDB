using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api")]
    public class PasteDataController : ControllerBase
    {
        private readonly string _connectionString;

        public PasteDataController()
        {
            _connectionString =
                "Server=localhost;User ID=root;Password=Interstellar@2014;Database=employeedb";
        }

        public class PasteDataRequest
        {
            public List<List<string>> Data { get; set; }
            public int Row { get; set; }
            public int Col { get; set; }
        }

        [HttpPost("PasteData")]
        public async Task<ActionResult> PasteData([FromBody] PasteDataRequest request)
        {
            using var connection = new MySqlConnection(_connectionString);
            var startrow = request.Row;
            var startcol = request.Col;

            try
            {
                await connection.OpenAsync();

                for (int i = 0; i < request.Data.Count; i++)
                {
                    var setClauses = new StringBuilder();

                    for (int j = 0; j < request.Data[i].Count; j++)
                    {
                        setClauses.Append($"`{startcol + j + 2}` = @data{i}_{j}, ");
                    }

                    if (setClauses.Length > 2)
                        setClauses.Length -= 2;

                    string query = $"UPDATE employeeinfo SET {setClauses} WHERE `{1}` = @row";

                    using var command = new MySqlCommand(query, connection);

                    for (int j = 0; j < request.Data[i].Count; j++)
                    {
                        command.Parameters.AddWithValue($"@data{i}_{j}", request.Data[i][j]);
                    }

                    command.Parameters.AddWithValue("@row", startrow + i);
                    await command.ExecuteNonQueryAsync();
                }

                return Ok(new { Status = true, RowsAffected = request.Data.Count });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            finally
            {
                if (connection.State == System.Data.ConnectionState.Open)
                {
                    await connection.CloseAsync();
                }
            }
        }
    }
}
