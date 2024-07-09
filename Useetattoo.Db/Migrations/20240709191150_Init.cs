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
                    Ort = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ErstelltAm = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ErstelltVon = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    GeaendertAm = table.Column<DateTime>(type: "datetime2", nullable: true),
                    GeaendertVon = table.Column<string>(type: "nvarchar(210)", maxLength: 210, nullable: true)
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

            migrationBuilder.CreateTable(
                name: "Signatures",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Hash = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Date = table.Column<DateTime>(type: "datetime2", maxLength: 200, nullable: true),
                    Image = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    Points = table.Column<string>(type: "VARCHAR(MAX)", nullable: true),
                    DeclarationId = table.Column<long>(type: "bigint", nullable: false),
                    ErstelltAm = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ErstelltVon = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    GeaendertAm = table.Column<DateTime>(type: "datetime2", nullable: true),
                    GeaendertVon = table.Column<string>(type: "nvarchar(210)", maxLength: 210, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Signatures", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Signatures_Declarations_DeclarationId",
                        column: x => x.DeclarationId,
                        principalTable: "Declarations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Signatures_DeclarationId",
                table: "Signatures",
                column: "DeclarationId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Signatures");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Declarations");
        }
    }
}
