using MassTransit;
using MsgContracts;
using System.Reflection;

namespace MassTransitDemo.Utils
{
    public class MTInitializer
    {
        public static void SetJson(ConfigurationManager configuration)
        {
            var dir = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            var path = Path.Combine(dir, "commonappsettings.json");
            configuration.AddJsonFile(path, false, true);
        }

        public static void ConfigureMassTransit(WebApplicationBuilder builder,
                                                MassTransitSettings appSettings)
        {
            var serviceProvider = appSettings.Provider;

            builder.Services.AddOptions<MassTransitHostOptions>()
            .Configure(options =>
            {
                options.WaitUntilStarted = true;
            });

            _ = builder.Services.AddMassTransit(x =>
            {
                x.AddConsumer<MessageConsumer>();
                x.SetKebabCaseEndpointNameFormatter();

                //switch code
                switch (serviceProvider)
                {
                    case Provider.InMemory:
                        x.UsingInMemory((context, cfg) =>
                        {
                            cfg.ConfigureEndpoints(context);
                        });
                        break;
                    case Provider.Azure:
                        x.AddServiceBusMessageScheduler();
                        x.UsingAzureServiceBus((context, cfg) =>
                        {
                            cfg.Host(appSettings.Azure.ConnectionString);
                            cfg.Send<DecosQ>(s => s.UseCorrelationId(x => x.Id));

                            cfg.SubscriptionEndpoint<DecosQ>("message-submitted-decos", e =>
                            {
                                e.ConfigureConsumer<MessageConsumer>(context);
                            });
                            cfg.ConfigureEndpoints(context);
                        });
                        break;
                    case Provider.AWS:
                        var aws = appSettings.Aws;
                        x.UsingAmazonSqs((context, cfg) =>
                        {
                            string awsRegion = aws.Region;
                            cfg.Host(awsRegion, h =>
                            {
                                h.AccessKey(aws.AccessKey);
                                h.SecretKey(aws.SecretKey);

                                h.Scope("dev", true);
                                h.EnableScopedTopics();
                            });

                            cfg.Message<DecosQ>(x =>
                            {
                                x.SetEntityName(aws.QueueName);
                            });

                            cfg.ConfigureEndpoints(context);
                            //cfg.ConfigureEndpoints(context, new MyEndpointNameFormatter(new DefaultEndpointNameFormatter(false)));
                        });
                        break;
                    case Provider.RabbitMq:
                        var rabbitMQ = appSettings.RabbitMQ;
                        x.UsingRabbitMq((context, cfg) =>
                        {
                            cfg.Host(rabbitMQ.Host, hCfg =>
                            {
                                hCfg.Username(rabbitMQ.Username);
                                hCfg.Password(rabbitMQ.Password);
                            });

                            cfg.ConfigureEndpoints(context);
                        });
                        break;
                    default:
                        break;
                }

                x.AddConfigureEndpointsCallback((name, cfg) =>
                {
                    if (cfg is IRabbitMqReceiveEndpointConfigurator rmq)
                        rmq.SetQuorumQueue(3);

                    cfg.UseMessageRetry(r => r.Immediate(2));
                });

            });
        }
    }
}
