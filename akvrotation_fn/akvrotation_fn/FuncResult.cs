using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

namespace akvrotation_fn
{
    public class FuncResult
    {
        public string SqlName { get; set; }

        public string Location { get; set; }

        public string User { get; set; }
    }

    public class PsMessage
    {
        public string Env { get; set; }

        public IDictionary<string, string> Secrets { get; set; }

        public string PwdSecretName { get; set; }
    }

    public class RotationResult
    {
        public bool IsSuccess { get; set; }

        public Azure.Security.KeyVault.Secrets.SecretClient Client { get; set; }

        public Azure.Security.KeyVault.Secrets.KeyVaultSecret OldSecret { get; set; }

        public PsMessage WebAppScriptInput { get; set; }

        public PsMessage SqlSyncScriptInput { get; set; }
    }

    public static class FuncExtensions
    {
        public static void LogFn(this ILogger log, string message)
        {
            log.LogInformation(message);
        }
    }
}
