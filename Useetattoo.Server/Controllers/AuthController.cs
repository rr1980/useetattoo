using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Useetattoo.Common;
using Useetattoo.Db;
using Useetattoo.Entities;
using Useetattoo.Services.Interfaces;
using Useetattoo.ViewModels;

namespace Useetattoo.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IAuthService _authService;

        public AuthController(IConfiguration configuration, IAuthService authService)
        {
            _configuration = configuration;
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("GetToken")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetToken([FromBody, Required] LoginRequestVM request)
        {
            IActionResult response = Unauthorized();

            var result = await _authService.LoginAsync(request);

            if (result.IsAuthenticated)
            {
                response = Ok(result);
            }

            return response;
        }
    }
}


