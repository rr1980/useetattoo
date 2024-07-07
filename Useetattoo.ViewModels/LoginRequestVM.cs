using System.ComponentModel.DataAnnotations;

namespace Useetattoo.ViewModels
{
    public class LoginRequestVM
    {
        [Required]
        public string? Username { get; set; }

        [Required]
        public string? Password { get; set; }
    }

    public class LoginResponseVM
    {
        public string? Token { get; set; }
        public bool IsAuthenticated => !string.IsNullOrEmpty(Token);
    }
}
