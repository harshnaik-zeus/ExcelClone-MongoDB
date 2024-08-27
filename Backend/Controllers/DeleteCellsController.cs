using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api")]
    public class DeleteCellsController : ControllerBase
    {
        private readonly string _connectionString;

        public DeleteCellsController()
        {
            _connectionString = "Server=localhost;User ID=root;Password=Interstellar@2014;Database=employeedb";
        }

        [HttpDelete("deletecells")]
        public async Task<ActionResult> DeleteCells(
            [FromQuery] int r1,
            [FromQuery] int c1,
            [FromQuery] int r2,
            [FromQuery] int c2
            )
        {
            using var connection = new MySqlConnection(_connectionString);

            if (r1 > r2) (r1, r2) = (r2, r1);
            if (c1 > c2) (c1, c2) = (c2, c1);
            try
            {
                await connection.OpenAsync();


                var setClauses = new List<string>();
                for (int i = c1 + 2; i <= c2 + 2; i++)
                {
                    setClauses.Add($"`{i}` = ''");
                }
                string setClause = string.Join(", ", setClauses);

                string query = $"UPDATE employeeinfo SET {setClause} WHERE `{1}` BETWEEN @r1 AND @r2";

                using (var command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@r1", r1);
                    command.Parameters.AddWithValue("@r2", r2);

                    await command.ExecuteNonQueryAsync();
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            finally
            {
                await connection.CloseAsync();
            }
        }
    }
}
