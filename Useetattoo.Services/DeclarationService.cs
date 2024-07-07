using Microsoft.Extensions.Configuration;
using System.Text.Json;
using Useetattoo.Common;
using Useetattoo.Db;
using Useetattoo.Entities;
using Useetattoo.Services.Interfaces;

namespace Useetattoo.Services
{
    public class DeclarationService : IDeclarationService
    {
        private readonly DatenbankContext _datenbankContext;
        private readonly IConfiguration _configuration;

        public DeclarationService(IConfiguration configuration, DatenbankContext datenbankContext)
        {
            _datenbankContext = datenbankContext;
            _configuration = configuration;
        }

        public object GetAll()
        {
            var result = _datenbankContext.Declarations.Select(x => new
            {
                x.Id,
                x.Name,
                x.Vorname,
                x.Anrede,
                Geburtsdatum = x.Geburtsdatum.ToAngularString(),
                x.GeborenIn,
                x.Strasse,
                x.Plz,
                x.Ort
            }).ToList();

            return result;
        }

        public long? Add(JsonElement body)
        {
            long? id = null;

            if (body.GetProperty("id").ValueKind == JsonValueKind.Number)
            {
                if (body.GetProperty("id").TryGetInt64(out long _id))
                {
                    id = _id;
                }
            }

            Declaration? declaration = null;

            if (id.HasValue)
            {
                declaration = _datenbankContext.Declarations.Find(id.Value);
                if (declaration != null)
                {
                    declaration.Name = body.GetProperty("name").GetString();
                    declaration.Vorname = body.GetProperty("vorname").GetString();
                    declaration.Anrede = body.GetProperty("anrede").GetString();
                    declaration.Geburtsdatum = body.GetProperty("geburtsdatum").ToNullableDateTime();
                    declaration.GeborenIn = body.GetProperty("geborenIn").GetString();
                    declaration.Strasse = body.GetProperty("strasse").GetString();
                    declaration.Plz = body.GetProperty("plz").GetString();
                    declaration.Ort = body.GetProperty("ort").GetString();

                    _datenbankContext.SaveChanges();
                }
            }
            else
            {
                declaration = new Declaration
                {
                    Name = body.GetProperty("name").GetString(),
                    Vorname = body.GetProperty("vorname").GetString(),
                    Anrede = body.GetProperty("anrede").GetString(),
                    Geburtsdatum = body.GetProperty("geburtsdatum").ToNullableDateTime(),
                    GeborenIn = body.GetProperty("geborenIn").GetString(),
                    Strasse = body.GetProperty("strasse").GetString(),
                    Plz = body.GetProperty("plz").GetString(),
                    Ort = body.GetProperty("ort").GetString()
                };

                _datenbankContext.Add(declaration);

                _datenbankContext.SaveChanges();
            }

            return declaration?.Id;
        }
    }
}
