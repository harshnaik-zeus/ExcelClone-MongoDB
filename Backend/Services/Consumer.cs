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

        var consumer = new EventingBasicConsumer(_channel);
        consumer.Received += (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
        };

        _channel.BasicConsume(queue: "csv_queue", autoAck: true, consumer: consumer);
    }

}
