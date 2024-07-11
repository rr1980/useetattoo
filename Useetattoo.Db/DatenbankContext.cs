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
using System.Reflection.Metadata;

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
        public virtual DbSet<Signature> Signatures { get; set; }


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
                table.Property(e => e.Name).HasMaxLength(100);
                table.Property(e => e.Vorname).HasMaxLength(200);

            });

            modelBuilder.Entity<Declaration>(table =>
            {
                table.HasKey(e => e.Id);

                table.Property(e => e.ErstelltAm);
                table.Property(e => e.ErstelltVon).HasMaxLength(100);

                table.Property(e => e.GeaendertAm);
                table.Property(e => e.GeaendertVon).HasMaxLength(100);

                table.Property(e => e.Name).HasMaxLength(100);
                table.Property(e => e.Vorname).HasMaxLength(100);
                table.Property(e => e.Geschlecht).HasMaxLength(20);
                table.Property(e => e.Geburtsdatum);
                table.Property(e => e.GeborenIn).HasMaxLength(100);
                table.Property(e => e.Strasse).HasMaxLength(100);
                table.Property(e => e.Hausnummer).HasMaxLength(10);
                table.Property(e => e.Plz).HasMaxLength(10);
                table.Property(e => e.Ort).HasMaxLength(100);
                table.Property(e => e.Land).HasMaxLength(100);
                table.Property(e => e.Bundesland).HasMaxLength(100);
                table.Property(e => e.Telefon).HasMaxLength(100);
                table.Property(e => e.Email).HasMaxLength(100);

                table.Property(e => e.Bluterkrankung).HasMaxLength(10);
                table.Property(e => e.Hauterkrankungen).HasMaxLength(10);
                table.Property(e => e.BlutverduennendeMedikamente).HasMaxLength(10);
                table.Property(e => e.Allergien).HasMaxLength(10);
                table.Property(e => e.HerzKreislaufbeschwerden).HasMaxLength(10);

                table.HasOne(e => e.Signagture)
                    .WithOne(e => e.Declaration)
                    .HasForeignKey<Signature>(e => e.DeclarationId)
                    .IsRequired();
            });

            modelBuilder.Entity<Signature>(table =>
            {
                table.HasKey(e => e.Id);

                table.Property(e => e.ErstelltAm);
                table.Property(e => e.ErstelltVon).HasMaxLength(50);

                table.Property(e => e.GeaendertAm);
                table.Property(e => e.GeaendertVon).HasMaxLength(210);

                table.Property(e => e.Hash).HasMaxLength(200);
                table.Property(e => e.Date).HasMaxLength(200);
                table.Property(e => e.Image).HasColumnType("varbinary(max) ");
                table.Property(e => e.Points).HasColumnType("VARCHAR(MAX)");
                table.Property(e => e.PointerTypes).HasMaxLength(50);

                table.HasOne(e => e.Declaration)
                    .WithOne(e => e.Signagture);
            });
        }


        // -------------


        private void SetAenderungen()
        {
            User? aenderungsBenutzer = default(User);

            if (_httpContextAccessor.HttpContext != null)
            {
                var _uId = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == "UserId").Select(x => x.Value).FirstOrDefault();
                if (!string.IsNullOrEmpty(_uId))
                {

                    var uId = long.Parse(_uId);
                    if (uId == 0)
                    {
                        throw new Exception("UserID not Found!");
                    }

                    aenderungsBenutzer = Users.FirstOrDefault(x => x.Id == uId);
                }
            }

            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is ChangeStateEntity && (
                        e.State == EntityState.Added
                        || e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                var entity = ((ChangeStateEntity)entityEntry.Entity);

                entity.GeaendertAm = DateTime.Now;
                //entity.GeaendertVon = aenderungsBenutzer != null ? aenderungsBenutzer.Name + ", " + aenderungsBenutzer.Vorname : "System";
                entity.GeaendertVon = aenderungsBenutzer != null ? aenderungsBenutzer.Benutzername : "System";

                if (entityEntry.State == EntityState.Added)
                {
                    entity.ErstelltAm = DateTime.Now;
                    //entity.ErstelltVon = aenderungsBenutzer != null ? aenderungsBenutzer.Name + ", " + aenderungsBenutzer.Vorname : "System";
                    entity.ErstelltVon = aenderungsBenutzer != null ? aenderungsBenutzer.Benutzername : "System";
                }
            }
        }

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            SetAenderungen();

            return base.SaveChanges(acceptAllChangesOnSuccess);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            SetAenderungen();

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}