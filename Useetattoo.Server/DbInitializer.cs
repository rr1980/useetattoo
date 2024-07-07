using Microsoft.EntityFrameworkCore;
using Useetattoo.Common;
using Useetattoo.Db;
using Useetattoo.Entities;

namespace Useetattoo.Server
{
    public static class DbInitializer
    {
        public static void Initialize(DatenbankContext context, string salt)
        {
            //context.Database.EnsureCreated();
            context.Database.Migrate();

            // Look for any students.
            if (context.Users.Any())
            {
                return;   // DB has been seeded
            }


            var benutzer = new User
            {
                Benutzername = "rr1980",
                Passwort = PasswortHasher.HashPasswort("123", salt)

            };
            context.Users.Add(benutzer);
            context.SaveChanges();
        }
    }
}