using System.ComponentModel.DataAnnotations;
using System.Text.Json;

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

    public class DeclarationItemAddVM
    {
        public long? Id { get; set; }

        [Required]
        public string? Name { get; set; }

        [Required]
        public string? Vorname { get; set; }

        [Required]
        public string? Anrede { get; set; }

        [Required]
        public JsonElement? Geburtsdatum { get; set; }

        public string? GeborenIn { get; set; }

        [Required]
        public string? Strasse { get; set; }

        [Required]
        public string? Plz { get; set; }

        [Required]
        public string? Ort { get; set; }

        [Required]
        public SignatureItemVM? Signature { get; set; }
    }

    public class DeclarationItemVM
    {
        public long? Id { get; set; }

        [Required]
        public string? Name { get; set; }

        [Required]
        public string? Vorname { get; set; }

        [Required]
        public string? Anrede { get; set; }

        [Required]
        public string? Geburtsdatum { get; set; }

        public string? GeborenIn { get; set; }

        [Required]
        public string? Strasse { get; set; }

        [Required]
        public string? Plz { get; set; }

        [Required]
        public string? Ort { get; set; }

        [Required]
        public SignatureItemVM? Signature { get; set; }
    }

    public class SignatureItemVM
    {
        public long? Id { get; set; }
        public string? Hash { get; set; }
        public string? Data { get; set; }
        public string? Date { get; set; }
        public byte[]? Image { get; set; }
        public string? Points { get; set; }
    }

    public class DeclarationSearchRequestVM
    {
        public int Skip { get; set; }
        public int Take { get; set; }
        public string? SearchTerm { get; set; }
        public string? SortColumn { get; set; }
        public string? SortDirection { get; set; }
    }
    public class DeclarationSearchResponseVM
    {
        public DeclarationSearchResponseVM()
        {
            Items = new List<DeclarationItemVM>();
        }
        public List<DeclarationItemVM> Items { get; set; }
        public long TotalCount { get; set; } = 0;
    }
}
