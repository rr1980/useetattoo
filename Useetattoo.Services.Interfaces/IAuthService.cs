using Useetattoo.ViewModels;

namespace Useetattoo.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseVM> LoginAsync(LoginRequestVM request);
    }
   
}
