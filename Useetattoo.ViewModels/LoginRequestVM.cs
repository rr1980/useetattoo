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

        public string? Name { get; set; }

        public string? Vorname { get; set; }

        public string? Geschlecht { get; set; }

        public DateTime? Geburtsdatum { get; set; }

        public string? GeborenIn { get; set; }

        public string? Strasse { get; set; }

        public string? Plz { get; set; }

        public string? Ort { get; set; }

        public string? Hausnummer { get; set; }

        public SignatureItemVM? Signature { get; set; }
    }

    public class DeclarationItemVM
    {
        public long? Id { get; set; }

        public DateTime? ErstelltAm { get; set; }
        public string? ErstelltVon { get; set; }

        public DateTime? GeaendertAm { get; set; }
        public string? GeaendertVon { get; set; }


        public string? Name { get; set; }
        public string? Vorname { get; set; }

        public string? Anrede { get; set; }
        public string? Geburtsdatum { get; set; }

        public string? GeborenIn { get; set; }

        public string? Strasse { get; set; }
        public string? Hasunummer { get; set; }

        public string? Plz { get; set; }

        public string? Ort { get; set; }

        public SignatureItemVM? Signature { get; set; }
    }

    public class DeclarationSearchItemVM
    {
        public long? Id { get; set; }

        public DateTime? ErstelltAm { get; set; }
        public string? ErstelltVon { get; set; }

        public DateTime? GeaendertAm { get; set; }
        public string? GeaendertVon { get; set; }

        public DateTime? Signiert { get; set; }

        public string? Name { get; set; }

        public string? Vorname { get; set; }

        public string? Geschlecht { get; set; }

        public string? Geburtsdatum { get; set; }

        public string? GeborenIn { get; set; }

        public string? Strasse { get; set; }

        public string? Plz { get; set; }

        public string? Ort { get; set; }
        public string? Hasunummer { get; set; }

    }

    public class SignatureItemVM
    {
        public long? Id { get; set; }
        public string? Hash { get; set; }
        public DateTime? Date { get; set; }
        public byte[]? Image { get; set; }
        public string? Points { get; set; }
        public string? PointerTypes { get; set; }
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
