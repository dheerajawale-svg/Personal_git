using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Abstractions;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Resolvers;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.OpenApi.Models;
using System.Net;

namespace FunctionAppOpenAPI
{
    public static class Function1
    {        
        [FunctionName("HaveSomeData")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "OpenApi" }, Description = "Simply returns an object with some date params. Swagger UI will reveal extensive usage of OpenApi extensions to document this function. (OpenApiOperation > Description)")]
        //[OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiRequestBody(contentType: "application/json", 
            bodyType: typeof(HotDate), Description = "HotDate", Required = true)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(HotDate), Description = "A Hot Date. (Set this under OpenApiResponseWithBody > Description)")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "POST", Route = null)] HttpRequest req)
        {
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);

            var obj = JsonConvert.DeserializeObject<HotDate>(requestBody);

            var response =
                new HotDate
                {
                    TodaysDate = DateTime.Now.ToString("dd/MM/yyyy"),
                    CurrentTime = DateTime.Now.ToString("T")
                };

            await Task.Yield();

            return new OkObjectResult(response);
        }
    }

    [OpenApiExample(typeof(HotDateExample))]
    public class HotDate
    {
        [OpenApiProperty(Description = "Today's date in the format dd/MM/yyyy  (OpenApiProperty > Description)")]
        [JsonProperty("TodaysDate")]
        public string TodaysDate { get; set; }

        [OpenApiProperty(Description = "Current time in the format HH:mm:ss  (OpenApiProperty > Description)")]
        [JsonProperty("CurrentTime")]
        public string CurrentTime { get; set; }
    }

    public class HotDateExample : OpenApiExample<HotDate>
    {
        public override IOpenApiExample<HotDate> Build(NamingStrategy namingStrategy = null)
        {
            Examples.Add(
                OpenApiExampleResolver.Resolve(
                    "HotDateExample",
                    new HotDate()
                    {
                        TodaysDate = "20/10/2021",
                        CurrentTime = "17:45:45"
                    },
                    namingStrategy
                ));

            return this;
        }
    }
}
