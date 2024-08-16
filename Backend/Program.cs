using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using RabbitMQ.Client;
using System;

public class Program
{
    public static void Main(string[] args)
    {
        var host = CreateHostBuilder(args).Build();
        host.Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureServices((hostContext, services) =>
            {
                // Configuration 
                var chunkSize = 5000;
                var connectionString = "Server=localhost;User ID=root;Password=Interstellar@2014;Database=employeedb";

                // Register RabbitMQ services 
                services.AddSingleton<IConnectionFactory>(sp => new ConnectionFactory() { HostName = "localhost" });
                services.AddSingleton(sp =>
                {
                    var factory = sp.GetRequiredService<IConnectionFactory>();
                    return factory.CreateConnection();
                });
                services.AddSingleton(sp =>
                {
                    var connection = sp.GetRequiredService<IConnection>();
                    return connection.CreateModel();
                });

                // Register custom services 
                services.AddSingleton<CsvChunkService>(sp => new CsvChunkService(chunkSize));
                services.AddSingleton<ProducerService>();
                services.AddSingleton<ConsumerService>(sp => new ConsumerService(sp.GetRequiredService<IModel>(), connectionString));

                // Hosted services 
                services.AddHostedService<Worker>();

                // Add Controllers (if applicable)
                services.AddControllers();
            });
}

// Worker class for hosting services 
public class Worker : BackgroundService
{
    private readonly ProducerService _producerService;
    private readonly ConsumerService _consumerService;

    public Worker(ProducerService producerService, ConsumerService consumerService)
    {
        _producerService = producerService;
        _consumerService = consumerService;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var csvFilePath = @"C:\Users\harsh.naik\Desktop\ExcelClone\users.csv";
        _producerService.ProduceChunks(csvFilePath);

        _consumerService.StartConsuming();

        await Task.CompletedTask;
    }
}
