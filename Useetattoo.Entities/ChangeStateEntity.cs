namespace Useetattoo.Entities
{
    public abstract class ChangeStateEntity : BaseEntity
    {
        public DateTime? ErstelltAm { get; set; }
        public string? ErstelltVon { get; set; }

        public DateTime? GeaendertAm { get; set; }
        public string? GeaendertVon { get; set; }

    }
}
