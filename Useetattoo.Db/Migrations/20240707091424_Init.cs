using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Useetattoo.Db.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Declarations",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Vorname = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Anrede = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Geburtsdatum = table.Column<DateTime>(type: "datetime2", nullable: true),
                    GeborenIn = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Strasse = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Plz = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Ort = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Declarations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Benutzername = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Passwort = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Declarations");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
