using System.Security.Principal;

namespace Useetattoo.Entities
{
    public class Declaration : ChangeStateEntity
    {
        public string? Name { get; set; }
        public string? Vorname { get; set; }
        public string? Geschlecht { get; set; }
        public DateTime? Geburtsdatum { get; set; }
        public string? GeborenIn { get; set; }
        public string? Strasse { get; set; }
        public string? Hausnummer { get; set; }
        public string? Plz { get; set; }
        public string? Ort { get; set; }
        public string? Land { get; set; }
        public string? Bundesland { get; set; }
        public string? Telefon { get; set; }
        public string? Email { get; set; }

        public string? Bluterkrankung { get; set; }
        public string? Hauterkrankungen { get; set; }
        public string? BlutverduennendeMedikamente { get; set; }
        public string? Allergien { get; set; }
        public string? HerzKreislaufbeschwerden { get; set; }

        public Signature? Signagture { get; set; }
    }

    public class Signature : ChangeStateEntity
    {
        public string? Hash { get; set; }
        public DateTime? Date { get; set; }
        public byte[]? Image { get; set; }
        public string? Points { get; set; }
        public string? PointerTypes { get; set; }


        public long? DeclarationId { get; set; }
        public Declaration? Declaration { get; set; }
    }
}
