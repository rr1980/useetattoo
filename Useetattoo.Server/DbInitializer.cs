using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Text;
using System.Text.Json;
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
            if (!context.Users.Any())
            {


                var benutzer = new User
                {
                    Benutzername = "rr1980",
                    Passwort = PasswortHasher.HashPasswort("123", salt)

                };
                context.Users.Add(benutzer);
                context.SaveChanges();
            }

            //if (!context.Signatures.Any() || context.Signatures.Count() < 100)
            //{


            //    var source = File.ReadAllText(@"c:\temp\signature.json", Encoding.UTF8);
                
            //    for (int i = 0; i < 10000; i++)
            //    {
            //        var orgDeclaration = JsonConvert.DeserializeObject<Declaration>(source)!;

            //        //orgDeclaration.Signagture!.Data!.Replace(orgDeclaration.Name!, (orgDeclaration.Name += "_" + i));
            //        //orgDeclaration.Signagture!.Data!.Replace(orgDeclaration.Vorname!, (orgDeclaration.Vorname += "_" + i));

            //        //var _newSignature = new Signature
            //        //{
            //        //    Hash = orgDeclaration.Signagture!.Hash,
            //        //    Data = orgDeclaration.Signagture.Data,
            //        //    Date = orgDeclaration.Signagture.Date,
            //        //    Image = orgDeclaration.Signagture.Image,
            //        //    Points = orgDeclaration.Signagture.Points,
            //        //};

            //        //var _newDeclaration = new Declaration
            //        //{
            //        //    Name = orgDeclaration.Name + "_" + i,
            //        //    Vorname = orgDeclaration.Vorname + "_" + i,
            //        //    Anrede = orgDeclaration.Anrede,
            //        //    Geburtsdatum = orgDeclaration.Geburtsdatum,
            //        //    GeborenIn = orgDeclaration.GeborenIn,
            //        //    Strasse = orgDeclaration.Strasse,
            //        //    Plz = orgDeclaration.Plz,
            //        //    Ort = orgDeclaration.Ort,
            //        //    Signagture = _newSignature
            //        //};

            //        //_newSignature.Declaration = _newDeclaration;

            //        //context.Declarations.Add(_newDeclaration);

            //        orgDeclaration.Id = 0;
            //        orgDeclaration.Signagture!.Id = 0;
            //        orgDeclaration.Signagture!.Data = orgDeclaration.Signagture!.Data!.Replace(orgDeclaration.Name!, (orgDeclaration.Name + "_" + i));
            //        orgDeclaration.Signagture!.Data = orgDeclaration.Signagture!.Data!.Replace(orgDeclaration.Vorname!, (orgDeclaration.Vorname + "_" + i));
            //        orgDeclaration.Name += "_" + i;
            //        orgDeclaration.Vorname += "_" + i;

            //        context.Declarations.Add(orgDeclaration);
            //    }

            //    context.SaveChanges();

            //}

        }
    }
}