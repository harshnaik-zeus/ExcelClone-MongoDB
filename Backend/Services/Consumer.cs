using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Data.SqlClient;
using System.Text;

public class ConsumerService
{
    private readonly IModel _channel;
    private readonly string _connectionString;

    public ConsumerService(IModel channel, string connectionString)
    {
        _channel = channel;
        _connectionString = connectionString;
    }

    public void StartConsuming()
    {
        var consumer = new EventingBasicConsumer(_channel);
        consumer.Received += (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            var lines = message.Split('\n');

            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                foreach (var line in lines)
                {
                    if (!string.IsNullOrWhiteSpace(line))
                    {
                        var values = line.Split(',');

                        // Construct the query to insert into all 14 columns
                        var query = @"INSERT INTO employeeinfos 
                                      (Column1, Column2, Column3, Column4, Column5, Column6, 
                                       Column7, Column8, Column9, Column10, Column11, Column12, 
                                       Column13, Column14) 
                                      VALUES (@value1, @value2, @value3, @value4, @value5, @value6, 
                                              @value7, @value8, @value9, @value10, @value11, @value12, 
                                              @value13, @value14)";

                        using (var command = new SqlCommand(query, connection))
                        {
                            // Add parameters for each of the 14 columns
                            for (int i = 0; i < 14; i++)
                            {
                                command.Parameters.AddWithValue($"@value{i + 1}", values.Length > i ? values[i] : (object)DBNull.Value);
                            }

                            // Execute the query
                            command.ExecuteNonQuery();
                        }
                    }
                }
            }
        };

        _channel.BasicConsume(queue: "csv_queue", autoAck: true, consumer: consumer);
    }
}
