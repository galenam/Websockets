using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace WebSockets
{
    public class CBRResponse
    {
        [JsonProperty("Date")]
        public DateTime Date { get; set; }
        [JsonProperty("PreviousDate")]
        public DateTime PreviousDate { get; set; }
        [JsonProperty("PreviousURL")]
        public string PreviousURL { get; set; }
        [JsonProperty("Timestamp")]
        public DateTime Timestamp { get; set; }
        [JsonProperty("Valute")]
        public Dictionary<string, Rate> Valute { get; set; }
    }
}