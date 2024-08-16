using RabbitMQ.Client;
using System;

public class Program
{
    public static void Main(string[] args)
    {
        var csvFilePath = @"C:\Users\harsh.naik\Desktop\ExcelClone\users.csv";
        var chunkSize = 5000;

        // RabbitMQ 
        var factory = new ConnectionFactory() { HostName = "localhost" };
        using var connection = factory.CreateConnection();
        using var channel = connection.CreateModel();

        // queue for the CSV chunks
        channel.QueueDeclare(queue: "csv_queue", durable: true, exclusive: false, autoDelete: false, arguments: null);

        // CSV chunk 
        var csvChunkService = new CsvChunkService(chunkSize);

        //producer

        var watch = new System.Diagnostics.Stopwatch();
        watch.Start();

        var producerService = new ProducerService(channel, csvChunkService);
        producerService.ProduceChunks(csvFilePath);

        // consumer
        var consumerService = new ConsumerService(channel);
        consumerService.StartConsuming();

        watch.Stop();
        Console.WriteLine($"Execution Time: {watch.ElapsedMilliseconds} ms");

        Console.WriteLine(" Press [enter] to exit.");
        Console.ReadLine();
    }
}
