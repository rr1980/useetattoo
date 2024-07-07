using System.Security.Principal;

namespace Useetattoo.Entities
{
    public class Declaration : ChangeStateEntity
    {
        public string? Name { get; set; }
        public string? Vorname { get; set; }
        public string? Anrede { get; set; }
        public DateTime? Geburtsdatum { get; set; }
        public string? GeborenIn { get; set; }
        public string? Strasse { get; set; }
        public string? Plz { get; set; }
        public string? Ort { get; set; }
    }
}
