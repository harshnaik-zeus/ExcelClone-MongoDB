using RabbitMQ.Client;
using System.Text;

public class ProducerService
{
    private readonly IModel _channel;
    private readonly CsvChunkService _csvChunkService;

    public ProducerService(IModel channel, CsvChunkService csvChunkService)
    {
        _channel = channel;
        _csvChunkService = csvChunkService;
    }

    public void ProduceChunks(string filePath)
    {
        var chunkNumber = 0;

        while (true)
        {
            var chunk = _csvChunkService.GetChunk(filePath, chunkNumber++);
            if (chunk.Count == 0)
                break;

            var message = string.Join("\n", chunk);
            var body = Encoding.UTF8.GetBytes(message);

            _channel.BasicPublish(exchange: "", routingKey: "csv_queue", basicProperties: null, body: body);
            Console.WriteLine($"{chunkNumber} chunk sent");

        }
    }

}
