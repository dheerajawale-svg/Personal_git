using System;
using System.Collections.Generic;
using System.Text;

namespace MsgContracts
{
    public class MassTransitSettings
    {
        public Provider Provider { get; set; }

        public RabbitMq RabbitMQ { get; set; }

        public Azure Azure { get; set; }

        public AWS Aws { get; set; }
    }

    public enum Provider
    {
        InMemory,
        Azure,
        AWS,
        RabbitMq
    }

    public class RabbitMq
    {
        public string Host { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }
    }

    public class AWS
    {
        public string Region { get; set; }

        public string AccessKey { get; set; }

        public string SecretKey { get; set; }

        public string QueueName { get; set; }
    }

    public class Azure
    {
        public string ConnectionString { get; set; }
    }
}
