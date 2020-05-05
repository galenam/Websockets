using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System.Net.WebSockets;
using System.Threading;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace WebSockets
{
    public class Startup
    {
        public IConfiguration Configuration { get; set; }
        ILogger<Startup> logger;
        readonly string cors = "cors";
        const string corsKey = "CORSUrl";
        public Startup(ILogger<Startup> _logger, IConfiguration conf)
        {
            logger = _logger;
            Configuration = conf;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            services.AddSingleton<ICBRRepository, CBRRepository>();
            services.AddMemoryCache();
            services.Configure<Options>(Configuration);
            var corsUrl = Configuration.GetValue<string>(corsKey);
            services.AddCors(options =>
            {
                options.AddPolicy(name: cors, builder =>
                {
                    builder.WithOrigins(corsUrl);
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ICBRRepository cbr)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            else
            {
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseCors(cors);
            app.UseMvc();

            app.UseWebSockets();
            app.Use(async (context, next) =>
            {
                if (context.Request.Path == "/ws")
                {
                    if (context.WebSockets.IsWebSocketRequest)
                    {
                        WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
                        await Echo(context, webSocket, cbr);
                    }
                    else
                    {
                        context.Response.StatusCode = 400;
                    }
                }
                else
                {
                    await next();
                }
            });
        }

        private async Task Echo(HttpContext context, WebSocket webSocket, ICBRRepository cbr)
        {
            var buffer = new byte[1024 * 4];
            WebSocketReceiveResult result = null;
            try
            {
                result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                while (!result.CloseStatus.HasValue)
                {
                    var arrayReceiveResult = new ArraySegment<byte>(buffer, 0, result.Count);
                    var incomingMessage = Encoding.Default.GetString(arrayReceiveResult.Array);
                    incomingMessage = incomingMessage.Substring(0, result.Count);
                    if (!string.IsNullOrEmpty(incomingMessage))
                    {
                        var dict = await cbr.GetAsync();
                        var rate = dict != null && dict.ContainsKey(incomingMessage) ? dict[incomingMessage] : null;
                        var rateString = JsonSerializer.Serialize(rate);
                        var arraySendResult = Encoding.Default.GetBytes(rateString);
                        await webSocket.SendAsync(new ArraySegment<byte>(arraySendResult, 0, (int)arraySendResult.Length), result.MessageType, result.EndOfMessage, CancellationToken.None);
                        result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "WebSocket");
            }
            if (result != null)
            {
                await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
            }
        }
    }
}
