using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace akvrotation_fn
{
    public class EmailService
    {

        public static async Task SendProgressMail(string env, IConfiguration configuration)
        {
            var apiKey = configuration["SENDGRID_API_KEY"];            
            var mailFrom = configuration["MailFrom"];
            var mailTo = configuration["MailTo"];
            var subject = $"Otocloud secret rotation started for {env}";
            var plainTextContent = "Changing SQL server passwords";

            await SendMail(apiKey, mailFrom, mailTo, subject, plainTextContent, plainTextContent);
        }

        public static async Task SendSuccessMail(string env, IConfiguration configuration)
        {
            var apiKey = configuration["SENDGRID_API_KEY"];
            var mailFrom = configuration["MailFrom"];
            var mailTo = configuration["MailTo"];
            var subject = $"Otocloud secret rotation finished for {env}";
            var plainTextContent = "SQL server passwords changed successfully";

            await SendMail(apiKey, mailFrom, mailTo, subject, plainTextContent, plainTextContent);
        }

        public static async Task SendFailureMail(string env, IConfiguration configuration)
        {
            var apiKey = configuration["SENDGRID_API_KEY"];
            var mailFrom = configuration["MailFrom"];
            var mailTo = configuration["MailTo"];
            var subject = $"Web API Powershell execution failed for {env}";
            var plainTextContent = "Web API Powershell execution failed";

            await SendMail(apiKey, mailFrom, mailTo, subject, plainTextContent, plainTextContent);
        }

        private static async Task SendMail(string apiKey, string mailFrom, string mailTo, 
                                            string subject, string plainTextContent, string htmlContent)
        {
            SendGridClient client = new SendGridClient(apiKey);

            var from = new EmailAddress(mailFrom, "AutomationTool");
            var to = new EmailAddress(mailTo);

            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
        }
    }
}
