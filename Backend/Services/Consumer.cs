using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;

public class ConsumerService
{
    private readonly IModel _channel;

    public ConsumerService(IModel channel)
    {
        _channel = channel;
    }

    public void StartConsuming()
    {

        var watch = new System.Diagnostics.Stopwatch();

        watch.Start();

        var consumer = new EventingBasicConsumer(_channel);
        consumer.Received += (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);

            // Process the chunk (message)
            // Console.WriteLine("Received Chunk:\n" + message);
        };

        _channel.BasicConsume(queue: "csv_queue", autoAck: true, consumer: consumer);
        watch.Stop();

        Console.WriteLine($"Execution Time: {watch.ElapsedMilliseconds} ms");
    }

}
