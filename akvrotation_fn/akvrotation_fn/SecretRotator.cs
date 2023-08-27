using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace akvrotation_fn
{
    public class SecretRotator
    {
        private const string CredentialIdTag = "CredentialId";
        private const string ValidityPeriodDaysTag = "ValidityPeriodDays";
        const string tenantId = "996b89b3-99e3-48ac-b9d7-5cbef8f4007d";

        public static async Task<RotationResult> RotateSecret(IConfiguration configuration, ILogger log, 
                                                    string keyVaultName, string secretName, 
                                                    string env)
        {
            RotationResult result = new RotationResult { IsSuccess = false };

            var client = GetSecretClient(log, keyVaultName);
            var secretPwd = client.GetSecret(secretName);
            
            if(secretPwd.Value.Properties != null && 
                secretPwd.Value.Properties.Enabled.HasValue && 
                secretPwd.Value.Properties.Enabled.Value == false)
            {
                log.LogInformation("Secret is already disabled... Exited! ...");
                return result;
            }

            if (secretPwd.Value.Properties != null && secretPwd.Value.Properties.Enabled == null)
            {
                log.LogInformation("Secret Not set correctly... Exited! ...");
                return result;
            }

            await EmailService.SendProgressMail(env, configuration);

            IDictionary<string, string> dataContextNames = await GetSecrets(client, env);
            if(dataContextNames.Count < 1)
            {
                log.LogError($"DataContext Secrets NOT Found for {env} environment");
                return result;
            }

            log.LogInformation("creating new password");
            var newPassword = CreateRandomPassword();
            string oldPassword = secretPwd.Value.Value;
            
            #region SQL Server

            var completedServers = new List<FuncResult>();

            try
            {
                log.LogInformation("Getting list of SQL servers");
                string urlGetSqlServers = configuration["PwUrlGetSqlServers"];
                var servers = await HttpHelper.GetSqlServers(urlGetSqlServers, env, log);
                if (servers.Length > 0)
                {
                    foreach (var sqlServer in servers)
                    {
                        log.LogInformation($"connect to {sqlServer.SqlName} using existing password and update it with new password");
                        UpdateDatabasePassword(oldPassword, sqlServer.SqlName, sqlServer.User, newPassword);
                        CheckDatabaseConnection(sqlServer.SqlName, sqlServer.User, newPassword); //it should throw error if  new password NOT set

                        completedServers.Add(sqlServer);
                    }

                    log.LogInformation("SQL Passwords changed successfully");
                }
                else
                {
                    log.LogInformation("SQL Servers NOT found");
                    return result;
                }
            }
            catch (Exception ex)
            {
                log.LogError(ex.Message);
                log.LogWarning("Reverting changes");

                foreach (var item in completedServers)
                {
                    log.LogInformation($"Reverting changes for {item}");
                    UpdateDatabasePassword(newPassword, item.SqlName, item.User, oldPassword);
                    CheckDatabaseConnection(item.SqlName, item.User, oldPassword);
                }

                completedServers.Clear();
                return result;
            }

            #endregion

            result.Client = client;
            result.OldSecret = secretPwd;

            log.LogInformation($"setting new secret-value in {secretName}");
            RotateSecret(client, secretPwd, newPassword, true);

            log.LogInformation($"setting new secret-value in 'DataContext' secrets");
            foreach (var context in dataContextNames)
            {
                KeyVaultSecret secret_DataContext = client.GetSecret(context.Key);
                RotateSecret(client, secret_DataContext, ReplaceConnectionString(newPassword, secret_DataContext.Value), false);
            }

            log.LogInformation("Secrets changed successfully");

            result.IsSuccess = true;
            result.WebAppScriptInput = new PsMessage()
            {
                Env = $"*{env}*", 
                Secrets = dataContextNames
            };

            result.SqlSyncScriptInput = new PsMessage()
            {
                Env = $"*{env}*",
                PwdSecretName = secretName
            };

            return result;
        }

        #region Helpers
        
        #region Secrets

        public static SecretClient GetSecretClient(ILogger log, string keyVaultName)
        {
            //Retrieve Current Secret
            var kvUri = "https://" + keyVaultName + ".vault.azure.net";

            //This goes to blog
            var azureCredentialOptions = new DefaultAzureCredentialOptions();
#if DEBUG

            azureCredentialOptions.SharedTokenCacheUsername = "dheeraj.awale@natus.com";
            azureCredentialOptions.VisualStudioTenantId = tenantId;
#endif
            DefaultAzureCredential credential = new DefaultAzureCredential(azureCredentialOptions);
            var client = new SecretClient(new Uri(kvUri), credential);

            return client;
        }

        private static async Task<IDictionary<string, string>> GetSecrets(SecretClient client, string env)
        {
            var secretList = new Dictionary<string, string>();

            var enumerator = client.GetPropertiesOfSecretsAsync().GetAsyncEnumerator();

            await enumerator.MoveNextAsync();

            var item = enumerator.Current;
            while (item != null)
            {
                string subStr = $"{env}-datacontext";
                if (item.Name.Contains(subStr))
                {
                    var targetFormat = $"@Microsoft.KeyVault(SecretUri={item.Id.AbsoluteUri}/)";
                    secretList.Add(item.Name, targetFormat);
                }

                if (!await enumerator.MoveNextAsync())
                {
                    break;
                }

                item = enumerator.Current;
            }

            return secretList;
        }

        public static void RotateSecret(SecretClient client, KeyVaultSecret oldSecret, string newSecretValue, bool expiryOn)
        {
            //var credentialId = secret.Properties.Tags.ContainsKey(CredentialIdTag) ? secret.Properties.Tags[CredentialIdTag] : "";
            var validityPeriodDays = oldSecret.Properties.Tags.ContainsKey(ValidityPeriodDaysTag) ?
                                     oldSecret.Properties.Tags[ValidityPeriodDaysTag] : "90";

            //add new secret version to key vault
            var newSecret = new KeyVaultSecret(oldSecret.Name, newSecretValue);
            if (expiryOn)
            {
                //disable old secret
                //oldSecret.Properties.ExpiresOn = null;
                //oldSecret.Properties.Enabled = false;
                //client.UpdateSecretProperties(oldSecret.Properties); //todo: check if its needed

                //newSecret.Properties.Tags.Add(CredentialIdTag, credentialId);
                newSecret.Properties.Tags.Add(ValidityPeriodDaysTag, validityPeriodDays);
                newSecret.Properties.ExpiresOn = GetClosestFriday(DateTime.UtcNow.AddDays(int.Parse(validityPeriodDays)));
            }

            client.SetSecret(newSecret);
        }

        public static void DisableSecret(SecretClient client, KeyVaultSecret secret)
        {
            //Disable old secret
            secret.Properties.ExpiresOn = null;
            secret.Properties.Enabled = false;
            client.UpdateSecretProperties(secret.Properties); //todo: check if its needed
        }

        #endregion

        #region SqlDatabase

        private static void UpdateDatabasePassword(string oldPassword, string dbName, string userId, string newpassword)
        {
            SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder();
            builder.DataSource = $"{dbName}.database.windows.net";
            builder.UserID = userId;
            builder.Password = oldPassword;

            //Update password
            using (SqlConnection connection = new SqlConnection(builder.ConnectionString))
            {
                connection.Open();

                string alterQuery = $"ALTER LOGIN [{userId}] WITH Password = '{newpassword}';";
                using (SqlCommand command = new SqlCommand(alterQuery, connection))
                {
                    command.ExecuteNonQuery();
                }
            }
        }
        private static void CheckDatabaseConnection(string dbName, string userId, string password)
        {
            //testserverotoscan.database.windows.net
            SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder();
            builder.DataSource = $"{dbName}.database.windows.net";
            builder.UserID = userId;
            builder.Password = password;
            using (SqlConnection connection = new SqlConnection(builder.ConnectionString))
            {
                connection.Open();
            }
        }
        #endregion

        private static string ReplaceConnectionString(string password, string secretValue)
        {
            var valArr = secretValue.Split(';');
            valArr[4] = $"Password = {password}";

            StringBuilder sb = new StringBuilder();
            foreach (var item in valArr)
            {
                if (string.IsNullOrEmpty(item))
                    continue;

                sb.Append(item);
                sb.Append(';');
            }

            var newValue = sb.ToString();
            return newValue;
        }
        private static string CreateRandomPassword()
        {
            const int length = 44;

            byte[] randomBytes = new byte[length];
            RNGCryptoServiceProvider rngCrypt = new RNGCryptoServiceProvider();
            rngCrypt.GetBytes(randomBytes);

            string mainStr = Convert.ToBase64String(randomBytes).Replace("-", string.Empty).Replace("=", string.Empty);
            mainStr = mainStr.Insert(length / 2, "$");
            return mainStr;
        }

        private static DateTimeOffset GetClosestFriday(DateTimeOffset dateTimeOffset)
        {
            DayOfWeek dayOfWeek = dateTimeOffset.DayOfWeek;
            if (dayOfWeek == DayOfWeek.Friday)
            {
                return dateTimeOffset;
            }
            else
            {
                var dist = MinDistanceTo(dayOfWeek, DayOfWeek.Friday);
                return dateTimeOffset.AddDays(dist);
            }
        }
        private static int MinDistanceTo(DayOfWeek from, DayOfWeek to)
        {
            int dist = to - from;
            return dist >= 4 ? dist - 7 : dist <= -4 ? dist + 7 : dist;
        }

        #endregion
    }
}
