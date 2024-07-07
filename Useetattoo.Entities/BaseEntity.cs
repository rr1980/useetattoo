using Useetattoo.Common.Interfaces;

namespace Useetattoo.Entities
{
    public abstract class BaseEntity : IEntity
    {
        public long Id { get; set; }
    }
}
