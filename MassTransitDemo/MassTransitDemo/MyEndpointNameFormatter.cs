using MassTransit;

namespace MassTransitDemo
{
    public class MyEndpointNameFormatter : IEndpointNameFormatter, IEntityNameFormatter
    {
        private string defQueueName = "MyCustomQueue";
        private readonly IEndpointNameFormatter defaultFormatter;

        public MyEndpointNameFormatter(IEndpointNameFormatter defaultFormatter)
        {
            this.defaultFormatter = defaultFormatter;
        }

        public string TemporaryEndpoint(string tag)
        {
            //return defaultFormatter.TemporaryEndpoint(tag);
            return defQueueName;
        }

        public string Consumer<T>() where T : class, IConsumer
        {
            //var defaultName = defaultFormatter.Consumer<T>();
            var defaultName = defQueueName;

            // Please give this a bit more thought. This is just to make a point.
            var type = typeof(T).GetInterfaces().First().GenericTypeArguments.First();

            if (type.Namespace.Contains("command", StringComparison.OrdinalIgnoreCase))
            {
                return defaultName + ".fifo";
            }

            return defaultName;
        }

        public string FormatEntityName<T>()
        {
            //var type = typeof(T);

            //if (type.Namespace.Contains("command", StringComparison.OrdinalIgnoreCase))
            //{
            //    return type.Name + ".fifo";
            //}

            //return type.Name;
            return defQueueName;
        }

        public string Message<T>() where T : class
        {
            //return defaultFormatter.Message<T>();
            return defQueueName;
        }

        public string Saga<T>() where T : class, ISaga
        {
            //return defaultFormatter.Saga<T>();
            return defQueueName;
        }

        public string ExecuteActivity<T, TArguments>() where T : class, IExecuteActivity<TArguments> where TArguments : class
        {
            return defaultFormatter.ExecuteActivity<T, TArguments>();
        }

        public string CompensateActivity<T, TLog>() where T : class, ICompensateActivity<TLog> where TLog : class
        {
            return defaultFormatter.CompensateActivity<T, TLog>();
        }

        public string SanitizeName(string name)
        {
            return name;
        }

        public string Separator { get; }
    }
}