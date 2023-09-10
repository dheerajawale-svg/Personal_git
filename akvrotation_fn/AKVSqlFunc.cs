// Default URL for triggering event grid function in the local environment.
// http://localhost:7071/runtime/webhooks/EventGrid?functionName={functionname}

using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.EventGrid.Models;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Microsoft.Extensions.Logging;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace akvrotation_fn
{
    public static class AKVSqlFunc
    {
        static IConfiguration _configuration;
        static string eventTypeName = "Microsoft.KeyVault.SecretExpired";

        [FunctionName("otocloud-secret-rotation")]
        public static async Task Run([EventGridTrigger]EventGridEvent eventGridEvent, ILogger log, ExecutionContext context)
        {
            string secretName = eventGridEvent.Subject;
            
            #region Initialization

            if (_configuration == null)
            {
                log.LogWarning("New Instance of Function");

                _configuration = new ConfigurationBuilder().SetBasePath(context.FunctionAppDirectory)
                                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                                .AddEnvironmentVariables().Build();
            }

            #endregion

            var urlSetWebApp = _configuration["PwUrlSetWebApp"];
            var urlUpdateSqlSync = _configuration["PwUrlUpdateSqlSync"];
            var passwordConvention = _configuration["PasswordConvention"];
            var apiKey = _configuration["SENDGRID_API_KEY"];
            var env = GetEnvironment(secretName);

            #region Validation

            if (!secretName.Contains($"{passwordConvention}{env}"))
            {
                return;
            }

            if (eventGridEvent.EventType != eventTypeName)
            {
                log.LogWarning("Wrong Event Recieved! Exit!");
                return;
            }

            log.LogInformation($"Secret Name: {secretName}");
            var keyVaultName = Regex.Match(eventGridEvent.Topic, ".vaults.(.*)").Groups[1].ToString();

            #endregion

            
            var result = await SecretRotator.RotateSecret(_configuration, log, keyVaultName, 
                                                           eventGridEvent.Subject, env);

            if(result.IsSuccess)
            {
                await EmailService.SendSuccessMail(env, _configuration);

                try
                {
                    log.LogInformation("Calling PS Func");
                    
                    HttpHelper.SetWebAppConfig(urlSetWebApp, result.WebAppScriptInput, log);
                    HttpHelper.UpdateAzSqlSync(urlUpdateSqlSync, result.SqlSyncScriptInput, log);
                    SecretRotator.DisableSecret(result.Client, result.OldSecret);

                    log.LogInformation("Process Finished!!");
                }
                catch (Exception ex)
                {
                    await EmailService.SendFailureMail(env, _configuration);
                    log.LogError(ex.Message);
                    log.LogWarning("Powershell Failed");
                }
            }
            else
            {
                await EmailService.SendFailureMail(env, _configuration);
            }
        }

        private static string GetEnvironment(string secretName)
        {
            var subArr = secretName.Split('-');
            var env = subArr[^1];

            return env; 
        }
    }
}
