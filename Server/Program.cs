using System.IO;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using NLog.Web;

namespace WebSockets
{
    public class Program
    {
        public static void Main(string[] args)
        {
            NLog.Web.NLogBuilder.ConfigureNLog("nlog.config");
            CreateWebHostBuilder(args)
            .Build()
            .Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args).
            ConfigureAppConfiguration((builderContext, config) =>
            {
                config.SetBasePath($"{Directory.GetCurrentDirectory()}")
                .AddJsonFile("appsettings.json", true, true).Build();
            })
                .UseStartup<Startup>()
                .UseNLog();

    }
}
