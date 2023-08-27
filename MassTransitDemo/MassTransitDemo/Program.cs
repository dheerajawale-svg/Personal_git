using MassTransit;
using MassTransitDemo.Utils;
using MsgContracts;

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

            builder.Configuration.AddJsonFile("commonappsettings.json", false, true);

            var settings = builder.Configuration.GetSection("MassTransit").Get<MassTransitSettings>();

            Utils.MTInitializer.ConfigureMassTransit(builder, settings); // MassTransit

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