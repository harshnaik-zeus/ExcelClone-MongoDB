using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api")]
    public class ProgressBarController : ControllerBase
    {
        private readonly string _connectionString;

        public ProgressBarController()
        {
            _connectionString = "Server=localhost;User ID=root;Password=Interstellar@2014;Database=employeedb";
        }

        [HttpGet("getUploadStatus")]
        public async Task<ActionResult> ProgressBar()
        {
            using var connection = new MySqlConnection(_connectionString);
            try
            {
                await connection.OpenAsync();

                using var command = connection.CreateCommand();
                string query = $"SELECT totalchunks,recievedchunks FROM employeedb.chunkinfo;";

                command.CommandText = query;
                using var reader = await command.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {

                    var completedChunks = (int)reader["recievedchunks"];
                    var totalChunks = (int)reader["totalchunks"];

                    var percent = ((completedChunks * 100) / totalChunks);

                    return Ok(percent);
                }

                return Ok(-1);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            finally
            {
                await connection.CloseAsync();
            }
        }
    }
}