using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Useetattoo.Entities;

namespace Useetattoo.Db
{
    public class DatenbankContext : DbContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        //private readonly AppSetting _appSetting;
        private readonly IConfiguration _configuration;
        //-----

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Declaration> Declarations { get; set; }


        public DatenbankContext(DbContextOptions options, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
            : base(options)
        {
            //_appSetting = appSetting.Value;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(table =>
            {
                table.HasKey(e => e.Id);
                table.Property(e => e.Benutzername).HasMaxLength(100);
                table.Property(e => e.Passwort).HasMaxLength(300);

            });

            modelBuilder.Entity<Declaration>(table =>
            {
                table.HasKey(e => e.Id);
                table.Property(e => e.Name).HasMaxLength(100);
                table.Property(e => e.Vorname).HasMaxLength(100);
                table.Property(e => e.Anrede).HasMaxLength(20);
                table.Property(e => e.Geburtsdatum);
                table.Property(e => e.GeborenIn).HasMaxLength(100);
                table.Property(e => e.Strasse).HasMaxLength(100);
                table.Property(e => e.Plz).HasMaxLength(10);
                table.Property(e => e.Ort).HasMaxLength(100);
            });
        }



        // -------------


        //private void Log()
        //{
        //    Benutzer aenderungsBenutzer = default(Benutzer);

        //    if (_httpContextAccessor.HttpContext != null)
        //    {
        //        var _uId = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == "UserId").Select(x => x.Value).FirstOrDefault();
        //        if (!string.IsNullOrEmpty(_uId))
        //        {

        //            var uId = long.Parse(_uId);
        //            if (uId == 0)
        //            {
        //                throw new Exception("UserID not Found!");
        //            }

        //            aenderungsBenutzer = Benutzer.FirstOrDefault(x => x.ID == uId);
        //        }
        //    }

        //    //-------------

        //    List<EntityLog> entityLogs = new List<EntityLog>();

        //    var entries = ChangeTracker
        //        .Entries()
        //        .Where(e => e.Entity is ChangeStateEntity && (
        //                e.State == EntityState.Added
        //                || e.State == EntityState.Modified
        //                || e.State == EntityState.Deleted));

        //    foreach (var change in entries)
        //    {
        //        var entityName = change.Entity.GetType().Name;
        //        var entityID = GetPrimaryKeyValue(change);
        //        var entityGuid = GetStringProperty(change, "GuidKey");
        //        string _state = change.State.ToString();
        //        string description = "";

        //        if (entityName.Equals("AntragKitaPlatz")) 
        //        {
        //            string newStatus = "";

        //            long? originalValue = (long?) change.OriginalValues["StatusID"];
        //            long? currentValue = (long?)change.CurrentValues["StatusID"];
        //            long? recordId = (long?)change.CurrentValues["ID"];
        //            if (recordId < 0) recordId = null;
        //            string az = (string)change.CurrentValues["AntragsZeichen"];
        //            string description_2 = (change.CurrentValues["Nachname"] + ", " + change.CurrentValues["Vorname"]).ToString();
        //            if (originalValue != currentValue)
        //            {
        //                if (currentValue.HasValue)
        //                {
        //                    var item = StatusKatalog.FirstOrDefault(x => x.ID == currentValue);
        //                    if (item != null)
        //                    {
        //                        newStatus = item.Bezeichnung;
        //                    }
        //                }
        //            }
        //            description = TranslateState(change.State.ToString(), newStatus, aenderungsBenutzer);
        //            entityLogs.Add(new EntityLog
        //            {
        //                EntityName = entityName,
        //                EntityGuid = entityGuid,
        //                State = _state,
        //                Wer = aenderungsBenutzer != null ? aenderungsBenutzer.Name + ", " + aenderungsBenutzer.Vorname : "System",
        //                Wann = DateTime.Now,
        //                UserId = aenderungsBenutzer != null ? aenderungsBenutzer.ID : null,
        //                Description = description,
        //                RecordId = recordId,
        //                Az = az,
        //                Description_2 = description_2
        //            });
        //        } 
        //        else
        //        {
        //            _state = change.State.ToString();
        //            entityLogs.Add(new EntityLog
        //            {
        //                EntityName = entityName,
        //                EntityGuid = entityGuid,
        //                State = _state,
        //                Wer = aenderungsBenutzer != null ? aenderungsBenutzer.Name + ", " + aenderungsBenutzer.Vorname : "System",
        //                Wann = DateTime.Now,
        //                UserId = aenderungsBenutzer != null ? aenderungsBenutzer.ID : null,
        //                Description = description
        //            });
        //        }

        //        //foreach (var prop in change.OriginalValues.Properties)
        //        //{
        //        //  var originalValue = change.OriginalValues[prop.Name] == null ? "" : change.OriginalValues[prop.Name].ToString();
        //        //  var currentValue = change.CurrentValues[prop.Name] == null ? "" : change.CurrentValues[prop.Name].ToString();
        //        //  if (originalValue != currentValue) //Only create a log if the value changes
        //        //  }
        //        //}
        //    }

        //    EntityLogs.AddRange(entityLogs);
        //}

        //private static string TranslateState(string state, string newStatus, Benutzer benutzer)
        //{
        //    string user_typ = "";
        //    if (benutzer != null) {
        //        switch (benutzer.Discriminator)
        //        {
        //            case "Benutzer_Buerger":
        //                user_typ = "Bürger";
        //                break;
        //            case "Benutzer_Verwaltung":
        //                user_typ = "Verwaltung";
        //                break;
        //        }
        //    }

        //    switch (state)
        //    {
        //        case "Added":
        //            return "Hinzugefügt (" + user_typ + ")";
        //        case "Modified":
        //            return newStatus.Length > 0 ? "Bearbeitet mit Statusänderung zu \"" + newStatus + "\"": "Bearbeitet";
        //        case "Deleted":
        //            return "Gelöscht (" + user_typ + ")";
        //        default:
        //            return state;
        //    }
        //}

        //private void SetMandant()
        //{
        //    var entries = ChangeTracker
        //        .Entries()
        //        .Where(e => e.Entity is BaseEntity && (e.State == EntityState.Added));

        //    var mandant = Mandanten.FirstOrDefault(x => x.Schluessel.ToLower() == _appSetting.Mandant_Kuerzel.ToLower());

        //    foreach (var entityEntry in entries)
        //    {

        //        var entity = ((BaseEntity)entityEntry.Entity);

        //        if (entityEntry.State == EntityState.Added)
        //        {
        //            entity.MandantenSchluessel = mandant.Schluessel;
        //        }
        //    }
        //}

        //private void SetAenderungen()
        //{
        //    Benutzer aenderungsBenutzer = default(Benutzer);

        //    if (_httpContextAccessor.HttpContext != null)
        //    {
        //        var _uId = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == "UserId").Select(x => x.Value).FirstOrDefault();
        //        if (!string.IsNullOrEmpty(_uId))
        //        {

        //            var uId = long.Parse(_uId);
        //            if (uId == 0)
        //            {
        //                throw new Exception("UserID not Found!");
        //            }

        //            aenderungsBenutzer = Benutzer.FirstOrDefault(x => x.ID == uId);
        //        }
        //    }

        //    var entries = ChangeTracker
        //        .Entries()
        //        .Where(e => e.Entity is ChangeStateEntity && (
        //                e.State == EntityState.Added
        //                || e.State == EntityState.Modified));

        //    foreach (var entityEntry in entries)
        //    {
        //        var entity = ((ChangeStateEntity)entityEntry.Entity);

        //        entity.GeaendertAm = DateTime.Now;
        //        entity.GeaendertVon = aenderungsBenutzer != null ? aenderungsBenutzer.Name + ", " + aenderungsBenutzer.Vorname : "System";

        //        if (entityEntry.State == EntityState.Added)
        //        {
        //            entity.ErstelltAm = DateTime.Now;
        //            entity.ErstelltVon = aenderungsBenutzer != null ? aenderungsBenutzer.Name + ", " + aenderungsBenutzer.Vorname : "System";
        //        }
        //    }

        //    //var entriesToDelete = ChangeTracker
        //    //    .Entries()
        //    //    .Where(e => e.Entity is ITemporaryStored && (
        //    //            e.State == EntityState.Added
        //    //            || e.State == EntityState.Modified));

        //    //foreach (var entityEntry in entriesToDelete)
        //    //{
        //    //    var entity = ((ITemporaryStored)entityEntry.Entity);
        //    //    string wert = _configuration["AppSetting:Aufbewahrungsfristen:Antrag"];
        //    //    int frist = 0;
        //    //    if(!string.IsNullOrEmpty(wert)) {
        //    //        int.TryParse(wert, out frist);
        //    //    }  

        //    //    if (frist > 0)
        //    //    {
        //    //        entity.LoeschenAm = new DateTime(DateTime.Now.Year, 12, 31).AddYears((int)frist);
        //    //    }
        //    //    else
        //    //    {
        //    //        entity.LoeschenAm = null;
        //    //    }
        //    //}
        //}

        //public override int SaveChanges(bool acceptAllChangesOnSuccess)
        //{
        //    Log();
        //    SetAenderungen();
        //    SetMandant();

        //    return base.SaveChanges(acceptAllChangesOnSuccess);
        //}

        ////public override int SaveChanges()
        ////{
        ////    Log();
        ////    SetAenderungen();
        ////    SetMandant();

        ////    return base.SaveChanges();
        ////}

        ////public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
        ////{
        ////    Log();
        ////    SetAenderungen();
        ////    SetMandant();

        ////    return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        ////}

        //public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        //{
        //    Log();
        //    SetAenderungen();
        //    SetMandant();

        //    return base.SaveChangesAsync(cancellationToken);
        //}

        //long GetPrimaryKeyValue(EntityEntry entry)
        //{
        //    var keyName = entry.Metadata.FindPrimaryKey().Properties.Select(x => x.Name).Single();
        //    return (long)entry.Property(keyName).CurrentValue;
        //}

        //string GetStringProperty(EntityEntry entry, string property)
        //{
        //    return (string)entry.Property(property).CurrentValue;
        //}
    }
}




//table.HasMany(v => v.Vertragspartner)
//    .WithMany(p => p.Vertraege)
//    .UsingEntity<Beitragsberechnung_Vertragspartner>(
//        j => j
//            .HasOne(vtp => vtp.Person)
//            .WithMany(p => p.Vertragspartner)
//            .HasForeignKey(vtp => vtp.PersonId),
//        j => j
//            .HasOne(vtp => vtp.Vertrag)
//            .WithMany(v => v.VertragspartnerZuPerson)
//            .HasForeignKey(vtp => vtp.VertragId),
//        j =>
//        {
//            j.HasKey(vtp => new { vtp.ID, vtp.VertragId, vtp.PersonId });
//            j.Property(vtp => vtp.MandantenSchluessel).HasMaxLength(10);
//            j.HasIndex(vtp => new { vtp.VertragId, vtp.PersonId, vtp.MandantenSchluessel });
//            j.HasQueryFilter(vtp => vtp.MandantenSchluessel.ToLower() == _appSetting.Mandant_Kuerzel.ToLower());
//            j.HasQueryFilter(vtp => vtp.Geloescht != true);
//        });