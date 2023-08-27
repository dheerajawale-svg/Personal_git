using System.Threading.Tasks;
using MassTransit;
using MassTransitConsumer;
using Microsoft.Extensions.Logging;
using MsgContracts;

namespace MassTransitConsumer
{
    public class MessageConsumer : IConsumer<DecosQ>
    {
        readonly ILogger<MessageConsumer> _logger;

        public MessageConsumer(ILogger<MessageConsumer> logger)
        {
            _logger = logger;
        }

        public Task Consume(ConsumeContext<DecosQ> context)
        {
            _logger.LogInformation("Received Text: {Text}", context.Message.Message);

            return Task.CompletedTask;
        }
    }
}