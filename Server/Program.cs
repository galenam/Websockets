using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
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
            //.GetDataFromCBR()
            .Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args).
            ConfigureAppConfiguration((builderContext, config) =>
            {
                //\\server\\
                config.SetBasePath($"{Directory.GetCurrentDirectory()}")
                .AddJsonFile("appsettings.json", true, true).Build();
            })
                .UseStartup<Startup>()
                .UseNLog();

    }
}
