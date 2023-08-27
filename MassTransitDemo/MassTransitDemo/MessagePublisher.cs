using MassTransit;
using MsgContracts;

namespace MassTransitDemo
{
    public class MessagePublisher : BackgroundService
    {
        private readonly IBus _bus;

        public MessagePublisher(IBus bus)
        {
            _bus = bus;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(7000, stoppingToken);

                Console.WriteLine("Enter Text and Press Enter");
                var userInput = Console.ReadLine();

                DecosQ message = new() { Message = $"You wrote: {userInput} at {DateTimeOffset.Now}" };
                await _bus.Publish(message, stoppingToken);

                //await _bus.Publish(new Message { Text = $"The time is {DateTimeOffset.Now}" }, stoppingToken);
                //await Task.Delay(5000, stoppingToken);
            }
        }
    }
}
