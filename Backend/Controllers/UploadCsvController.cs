using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/upload")]
    public class FileUploadController : ControllerBase
    {
        private readonly ProducerService _producerService;
        private readonly ConsumerService _consumerService;

        public FileUploadController(ProducerService producerService, ConsumerService consumerService)
        {
            _producerService = producerService;
            _consumerService = consumerService;
        }

        [HttpPost]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            var result = await WriteFile(file);

            _producerService.ProduceChunks(result);

            _consumerService.StartConsuming();
            return Ok(result);
        }

        private async Task<string> WriteFile(IFormFile file)
        {
            string filename = "users.csv";
            try
            {
                var filepath = Path.Combine(Directory.GetCurrentDirectory(), "Upload");
                if (!Directory.Exists(filepath))
                {
                    Directory.CreateDirectory(filepath);
                }
                var exactpath = Path.Combine(filepath, filename);
                using (var stream = new FileStream(exactpath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                Console.WriteLine(exactpath);
                return exactpath;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return "File upload failed";
            }
        }
    }
}
