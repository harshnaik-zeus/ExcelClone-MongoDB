using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api")]
    public class GetDataController : ControllerBase
    {
        private readonly string _connectionString;

        public GetDataController()
        {
            _connectionString = "Server=localhost;User ID=root;Password=Interstellar@2014;Database=employeedb";
        }

        [HttpGet("getPageData")]
        public async Task<ActionResult> GetPageData([FromQuery] int id = 0)
        {
            try
            {
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();

                string query = $"SELECT * FROM employeedb.employeeinfo ORDER BY `1` ASC LIMIT {id}, 100";
                using var command = new MySqlCommand(query, connection);
                using var reader = await command.ExecuteReaderAsync();

                var result = new List<Dictionary<string, object>>();

                while (await reader.ReadAsync())
                {
                    var row = new Dictionary<string, object>();
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        row[reader.GetName(i)] = reader.GetValue(i);
                    }
                    result.Add(row);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}