using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Text;

namespace Useetattoo.Common
{
    public static class PasswortHasher
    {
        public static string CreatePassword(int length)
        {
            const string valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!§$%&()=?";
            StringBuilder res = new StringBuilder();
            Random rnd = new Random();
            while (0 < length--)
            {
                res.Append(valid[rnd.Next(valid.Length)]);
            }
            return res.ToString();
        }

        public static string HashPasswort(string passwort, string salt)
        {
            byte[] saltBytes = Encoding.UTF8.GetBytes(salt);
            string hash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: passwort,
                salt: saltBytes,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8
                ));

            return hash;
        }
    }
}
