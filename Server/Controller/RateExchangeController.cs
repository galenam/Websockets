using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebSockets
{
    [Route("api/[controller]")]
    [ApiController]
    public class RateExchangeController : ControllerBase
    {
        ILogger<RateExchangeController> logger;
        ICBRRepository cBRRepository;

        public RateExchangeController(ILogger<RateExchangeController> _logger, ICBRRepository _cbrRepo)
        {
            logger = _logger;
            cBRRepository = _cbrRepo;
        }

        public async Task<IEnumerable<Rate>> Get()
        {
            return await cBRRepository.GetAsync();
        }

    }

}