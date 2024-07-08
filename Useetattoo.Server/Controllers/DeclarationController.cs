using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using Useetattoo.Services.Interfaces;
using Useetattoo.ViewModels;

namespace Useetattoo.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DeclarationController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IDeclarationService _declarationService;

        public DeclarationController(IConfiguration configuration, IDeclarationService declarationService)
        {
            _configuration = configuration;
            _declarationService = declarationService;
        }

        [HttpPost("Search")]
        //[ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<long?> Search([FromBody, Required] DeclarationSearchRequestVM request)
        {
            return Ok(_declarationService.Search(request));
        }

        [Authorize]
        [HttpPost("GetAll")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetAll()
        {
            return Ok(_declarationService.GetAll());
        }

        [HttpPost("Add")]
        //[ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<long?> Add([FromBody, Required] DeclarationItemAddVM request)
        {
            return Ok(_declarationService.Add(request));
        }

        [HttpPost("Test")]
        public ActionResult<long?> Test([FromBody, Required] JsonElement body)
        {
            int? id = null;

            if (body.GetProperty("id").ValueKind == JsonValueKind.Number)
            {
                if (body.GetProperty("id").TryGetInt32(out int _id))
                {
                    id = _id;
                }
            }

            if (id.HasValue)
            {
                return StatusCode(id.Value);
            }
            else
            {
                return BadRequest();
            }
        }
    }
}