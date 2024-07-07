using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Useetattoo.Common;
using Useetattoo.Db;
using Useetattoo.Entities;
using Useetattoo.Services.Interfaces;
using Useetattoo.ViewModels;

namespace Useetattoo.Services
{
    public class AuthService : IAuthService
    {
        private readonly DatenbankContext _datenbankContext;
        private readonly IConfiguration _configuration;

        public AuthService(IConfiguration configuration, DatenbankContext datenbankContext)
        {
            _datenbankContext = datenbankContext;
            _configuration = configuration;
        }

        public async Task<LoginResponseVM> LoginAsync(LoginRequestVM request)
        {
            var response = new LoginResponseVM();

            var hash = PasswortHasher.HashPasswort(request.Password!, _configuration["Salt"] ?? "7O123KYwvrAyGpudfdgTTZsoGPDqTKrFUPsiV3Ot");
            var benutzer = await _datenbankContext.Users.SingleOrDefaultAsync(x => !string.IsNullOrEmpty(x.Benutzername) && x.Benutzername.ToLower() == request.Username!.ToLower() && x.Passwort == hash);

            if (benutzer == null)
            {
                return response;
            }

            response.Token = _generateJSONWebToken(benutzer);

            return response;
        }

        private string _generateJSONWebToken(User benutzer)
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
                new Claim(JwtRegisteredClaimNames.Sub, benutzer.Benutzername!),
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
