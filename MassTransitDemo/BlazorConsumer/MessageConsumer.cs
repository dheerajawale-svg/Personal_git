using System.Threading.Tasks;
using EventAggregatorLib;
using MassTransit;
using Microsoft.Extensions.Logging;
using MsgContracts;

namespace BlazorConsumer
{
    public class MessageConsumer : IConsumer<DecosQ>
    {
        readonly ILogger<MessageConsumer> _logger;
        private readonly IEventAggregator _eventAggregator;

        public MessageConsumer(ILogger<MessageConsumer> logger, IEventAggregator eventAggregator)
        {
            _logger = logger;
            _eventAggregator = eventAggregator;
        }

        public Task Consume(ConsumeContext<DecosQ> context)
        {
            _logger.LogInformation("Received Text: {Text}", context.Message.Message);

            _eventAggregator.PublishEvent(context.Message.Message);

            return Task.CompletedTask;
        }
    }
}