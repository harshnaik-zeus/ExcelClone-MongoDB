using RabbitMQ.Client;
using System;

public class Program
{
    public static void Main(string[] args)
    {
        var csvFilePath = @"C:\Users\harsh.naik\Desktop\ExcelClone\users.csv"; // Update this path
        var chunkSize = 5000;

        // Set up RabbitMQ connection and channel
        var factory = new ConnectionFactory() { HostName = "localhost" };
        using var connection = factory.CreateConnection();
        using var channel = connection.CreateModel();

        // Declare a durable queue for the CSV chunks
        channel.QueueDeclare(queue: "csv_queue", durable: true, exclusive: false, autoDelete: false, arguments: null);

        // Set up the CSV chunk service
        var csvChunkService = new CsvChunkService(chunkSize);

        // Set up and run the producer
        var producerService = new ProducerService(channel, csvChunkService);
        producerService.ProduceChunks(csvFilePath);

        // Set up and run the consumer
        var consumerService = new ConsumerService(channel);
        consumerService.StartConsuming();

        // Keep the application running to consume messages
        Console.WriteLine(" Press [enter] to exit.");
        Console.ReadLine();
    }
}
