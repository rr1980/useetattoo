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
using Useetattoo.ViewModels;

namespace Useetattoo.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private IConfiguration _configuration;
        private readonly DatenbankContext _datenbankContext;

        public AuthController(IConfiguration configuration, DatenbankContext datenbankContext)
        {
            _configuration = configuration;
            _datenbankContext = datenbankContext;
        }

        [AllowAnonymous]
        [HttpPost("GetToken")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetToken([FromBody, Required] LoginRequestVM vm)
        {
            IActionResult response = Unauthorized();

            var hash = PasswortHasher.HashPasswort(vm.Password, _configuration["Salt"]);
            var benutzer = await _datenbankContext.Benutzer.SingleOrDefaultAsync(x => x.Benutzername.ToLower() == vm.Username.ToLower() && x.Passwort == hash);

            if (benutzer == null)
            {
                return response;
            }

            var tokenString = _generateJSONWebToken(benutzer);
            response = Ok(new { token = tokenString });

            return response;
        }

        private string _generateJSONWebToken(Benutzer benutzer)
        {
            var key = _configuration["Jwt:Key"];
            var issuer = _configuration["Jwt:Issuer"];
            if (string.IsNullOrEmpty(key) || string.IsNullOrEmpty(issuer))
            {
                throw new Exception("Jwt:Key or Jwt:Issuer is missing in appsettings.json");
            }
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[] {
                new Claim("UserId", benutzer.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, benutzer.Benutzername),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(issuer,
                issuer,
                claims,
                expires: DateTime.Now.AddMinutes(120),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
    }


