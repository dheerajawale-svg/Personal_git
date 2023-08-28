using MsgContracts;

namespace MassTransitConsumer
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            MTInitializer.SetJson(builder.Configuration);

            var settings = builder.Configuration.GetSection("MassTransit").Get<MassTransitSettings>();

            MTInitializer.ConfigureMassTransit<MessageConsumer>(builder.Services, settings, isReceiver: true); // MassTransit

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapGet("/", (HttpContext context) =>
            {
                return "Service is Up & Running";
            });

            app.MapControllers();

            app.Run();
        }
    }
}