using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using Useetattoo.Db;
using Useetattoo.Entities;
using Useetattoo.ViewModels;
using Useetattoo.Common;

namespace Useetattoo.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonController : ControllerBase
    {
        private IConfiguration _configuration;
        private readonly DatenbankContext _datenbankContext;

        public PersonController(IConfiguration configuration, DatenbankContext datenbankContext)
        {
            _configuration = configuration;
            _datenbankContext = datenbankContext;
        }

        [Authorize]
        [HttpPost("GetAll")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetAll()
        {
            return Ok(_datenbankContext.Personen.Select(x => new
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
            }).ToList());
        }

        [HttpPost("Add")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult Add([FromBody, Required] JsonElement body)
        {
            long? id = null;

            if (body.GetProperty("id").ValueKind == JsonValueKind.Number)
            {
                if (body.GetProperty("id").TryGetInt64(out long _id))
                {
                    id = _id;
                }
            }

            if (id.HasValue)
            {
                var person = _datenbankContext.Personen.Find(id.Value);
                if (person != null)
                {
                    person.Name = body.GetProperty("name").GetString();
                    person.Vorname = body.GetProperty("vorname").GetString();
                    person.Anrede = body.GetProperty("anrede").GetString();
                    person.Geburtsdatum = body.GetProperty("geburtsdatum").ToNullableDateTime();
                    person.GeborenIn = body.GetProperty("geborenIn").GetString();
                    person.Strasse = body.GetProperty("strasse").GetString();
                    person.Plz = body.GetProperty("plz").GetString();
                    person.Ort = body.GetProperty("ort").GetString();

                    _datenbankContext.SaveChanges();
                }
            }
            else
            {
                _datenbankContext.Add(new Person
                {
                    Name = body.GetProperty("name").GetString(),
                    Vorname = body.GetProperty("vorname").GetString(),
                    Anrede = body.GetProperty("anrede").GetString(),
                    Geburtsdatum = body.GetProperty("geburtsdatum").ToNullableDateTime(),
                    GeborenIn = body.GetProperty("geborenIn").GetString(),
                    Strasse = body.GetProperty("strasse").GetString(),
                    Plz = body.GetProperty("plz").GetString(),
                    Ort = body.GetProperty("ort").GetString()
                });

                _datenbankContext.SaveChanges();
            }

            return Ok();
        }
    }
}