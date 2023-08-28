using MassTransit;
using MsgContracts;
using System.Reflection;

namespace MassTransitDemo
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Console.Title = "Sender";

            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            MTInitializer.SetJson(builder.Configuration);

            var settings = builder.Configuration.GetSection("MassTransit").Get<MassTransitSettings>();

            MTInitializer.ConfigureMassTransit<MessageConsumer>(builder.Services, settings, isReceiver: false); // MassTransit

            builder.Services.AddHostedService<MessagePublisher>();

            var app = builder.Build();

            //---------------------------------------------------

            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }

    }
}