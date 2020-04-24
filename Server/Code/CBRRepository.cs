using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Linq;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Net.Http.Formatting;
using Newtonsoft.Json;

namespace WebSockets
{
    public class CBRRepository : ICBRRepository
    {
        const string cacheKey = "rates";
        static HttpClient client;
        ILogger<CBRRepository> logger;
        Options options;

        IMemoryCache cache;

        static CBRRepository()
        {
            client = new HttpClient();
        }

        public CBRRepository(ILogger<CBRRepository> _logger, IOptions<Options> _options, IMemoryCache _cache)
        {
            logger = _logger;
            options = _options.Value;
            cache = _cache;
        }
        public async Task<IEnumerable<Rate>> GetAsync()
        {
            IDictionary<string, Rate> dict;
            if (!cache.TryGetValue(cacheKey, out dict))
            {
                var httpResponse = await client.GetAsync(options.UrlRateOfExchange);
                var stringResponse = await httpResponse.Content.ReadAsStringAsync();

                var cbrResponse = JsonConvert.DeserializeObject<CBRResponse>(stringResponse);
                dict = cbrResponse?.Valute;
                cache.Set(cacheKey, dict, new System.DateTimeOffset(DateTime.Now.AddHours(options.HoursToCache)));

            }
            var result = dict?.Select(item => item.Value);
            return result;
        }
    }
}