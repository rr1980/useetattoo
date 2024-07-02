using Useetattoo.Common;
using Useetattoo.Db;
using Useetattoo.Entities;

namespace Useetattoo.Server
{
    public static class DbInitializer
    {
        public static void Initialize(DatenbankContext context, string salt)
        {
            context.Database.EnsureCreated();

            // Look for any students.
            if (context.Benutzer.Any())
            {
                return;   // DB has been seeded
            }


            var benutzer = new Benutzer
            {
                Benutzername = "rr1980",
                Passwort = PasswortHasher.HashPasswort("123", salt)

            };
            context.Benutzer.Add(benutzer);
            context.SaveChanges();
        }
    }
}