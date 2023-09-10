using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace akvrotation_fn
{
    public static class HttpHelper
    {
        private static readonly HttpClient httpClient = new HttpClient();

        static HttpHelper()
        {
            httpClient.Timeout = TimeSpan.FromMinutes(6);
        }

        public static async Task<FuncResult[]> GetSqlServers(string functionName, string env, ILogger log)
        {
            var request = new HttpRequestMessage()
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri(functionName),
                Content = new StringContent($"*{env}*")
            };

            var response = await httpClient.SendAsync(request);
            var stream = await response.Content.ReadAsStringAsync();
            
            FuncResult[] serverList = JsonConvert.DeserializeObject<FuncResult[]>(stream);
            return serverList;
        }

        public static void SetWebAppConfig(string functionUrl, PsMessage message, ILogger log)
        {
            SendOverHttp(functionUrl, message);
        }

        public static void UpdateAzSqlSync(string functionUrl, PsMessage message, ILogger log)
        {
            SendOverHttp(functionUrl, message);
        }

        private static void SendOverHttp(string functionUrl, PsMessage message)
        {
            var json = JsonConvert.SerializeObject(message);
            var request = new HttpRequestMessage()
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri(functionUrl),
                Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json")
            };

            _ = httpClient.SendAsync(request).ConfigureAwait(false);
        }
    }
}
