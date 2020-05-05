using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebSockets
{
    public interface ICBRRepository
    {
        Task<IDictionary<string, Rate>> GetAsync();
    }
}