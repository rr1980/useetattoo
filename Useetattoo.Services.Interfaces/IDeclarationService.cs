using System.Text.Json;

namespace Useetattoo.Services.Interfaces
{
    public interface IDeclarationService
    {
        object GetAll();
        long? Add(JsonElement body);
    }
    
}
