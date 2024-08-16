using RabbitMQ.Client;
using System;

public class Program
{
    public static void Main(string[] args)
    {
        var csvFilePath = @"C:\Users\harsh.naik\Desktop\ExcelClone\users.csv";
        var chunkSize = 5000;

        // Connection string for your SQL Server database
        var connectionString = "Server=localhost;Database=employeedb;User ID=root;Password=Interstellar@2014;";

        // RabbitMQ connection and channel setup
        var factory = new ConnectionFactory() { HostName = "localhost" };
        using var connection = factory.CreateConnection();
        using var channel = connection.CreateModel();

        // Declare the queue for the CSV chunks
        channel.QueueDeclare(queue: "csv_queue", durable: true, exclusive: false, autoDelete: false, arguments: null);

        // Initialize the CSV chunk service
        var csvChunkService = new CsvChunkService(chunkSize);

        // Producer service: send CSV chunks to the queue
        var watch = new System.Diagnostics.Stopwatch();
        watch.Start();

        var producerService = new ProducerService(channel, csvChunkService);
        producerService.ProduceChunks(csvFilePath);

        // Consumer service: process the CSV chunks from the queue and insert them into the database
        var consumerService = new ConsumerService(channel, connectionString);
        consumerService.StartConsuming();

        watch.Stop();
        Console.WriteLine($"Execution Time: {watch.ElapsedMilliseconds} ms");

        Console.WriteLine(" Press [enter] to exit.");
        Console.ReadLine();
    }
}
