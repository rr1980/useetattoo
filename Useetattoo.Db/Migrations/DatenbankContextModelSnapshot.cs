﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Useetattoo.Db;

#nullable disable

namespace Useetattoo.Db.Migrations
{
    [DbContext(typeof(DatenbankContext))]
    partial class DatenbankContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Useetattoo.Entities.Declaration", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"));

                    b.Property<string>("Anrede")
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.Property<DateTime?>("ErstelltAm")
                        .HasColumnType("datetime2");

                    b.Property<string>("ErstelltVon")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<DateTime?>("GeaendertAm")
                        .HasColumnType("datetime2");

                    b.Property<string>("GeaendertVon")
                        .HasMaxLength(210)
                        .HasColumnType("nvarchar(210)");

                    b.Property<string>("GeborenIn")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<DateTime?>("Geburtsdatum")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Ort")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Plz")
                        .HasMaxLength(10)
                        .HasColumnType("nvarchar(10)");

                    b.Property<string>("Strasse")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Vorname")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("Id");

                    b.ToTable("Declarations");
                });

            modelBuilder.Entity("Useetattoo.Entities.Signature", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"));

                    b.Property<DateTime?>("Date")
                        .HasMaxLength(200)
                        .HasColumnType("datetime2");

                    b.Property<long?>("DeclarationId")
                        .IsRequired()
                        .HasColumnType("bigint");

                    b.Property<DateTime?>("ErstelltAm")
                        .HasColumnType("datetime2");

                    b.Property<string>("ErstelltVon")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<DateTime?>("GeaendertAm")
                        .HasColumnType("datetime2");

                    b.Property<string>("GeaendertVon")
                        .HasMaxLength(210)
                        .HasColumnType("nvarchar(210)");

                    b.Property<string>("Hash")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<byte[]>("Image")
                        .HasColumnType("varbinary(max) ");

                    b.Property<string>("Points")
                        .HasColumnType("VARCHAR(MAX)");

                    b.HasKey("Id");

                    b.HasIndex("DeclarationId")
                        .IsUnique();

                    b.ToTable("Signatures");
                });

            modelBuilder.Entity("Useetattoo.Entities.User", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"));

                    b.Property<string>("Benutzername")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Passwort")
                        .HasMaxLength(300)
                        .HasColumnType("nvarchar(300)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Useetattoo.Entities.Signature", b =>
                {
                    b.HasOne("Useetattoo.Entities.Declaration", "Declaration")
                        .WithOne("Signagture")
                        .HasForeignKey("Useetattoo.Entities.Signature", "DeclarationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Declaration");
                });

            modelBuilder.Entity("Useetattoo.Entities.Declaration", b =>
                {
                    b.Navigation("Signagture");
                });
#pragma warning restore 612, 618
        }
    }
}
