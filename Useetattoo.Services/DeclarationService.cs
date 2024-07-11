﻿using Azure.Core;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Text;
using System.Text.Json;
using Useetattoo.Common;
using Useetattoo.Db;
using Useetattoo.Entities;
using Useetattoo.Services.Interfaces;
using Useetattoo.ViewModels;

namespace Useetattoo.Services
{
    public class DeclarationService : IDeclarationService
    {
        private readonly DatenbankContext _datenbankContext;
        private readonly IConfiguration _configuration;

        public DeclarationService(IConfiguration configuration, DatenbankContext datenbankContext)
        {
            _datenbankContext = datenbankContext;
            _configuration = configuration;
        }

        public async Task<LoadResult> Search(DataSourceLoadOptions loadOptions)
        {
            //loadOptions.Take = loadOptions.Take > 1000 ? 40 : loadOptions.Take;
            if (loadOptions.Take > 1000)
            {
                throw new ArgumentException("loadOptions.Take > 1000 !!!", "loadOptions.Take");
            }
            var source = from x in _datenbankContext.Declarations
                         select new DeclarationSearchItemVM
                         {
                             Id = x.Id,
                             ErstelltAm = x.ErstelltAm,
                             ErstelltVon = x.ErstelltVon,
                             GeaendertAm = x.GeaendertAm,
                             GeaendertVon = x.GeaendertVon,
                             Name = x.Name,
                             Vorname = x.Vorname,
                             Geschlecht = x.Geschlecht,
                             Geburtsdatum = x.Geburtsdatum.ToAngularString(),
                             GeborenIn = x.GeborenIn,
                             Strasse = x.Strasse,
                             Hasunummer = x.Hasunummer,
                             Plz = x.Plz,
                             Ort = x.Ort,
                             Signiert = x.Signagture != null ? x.Signagture.Date : null,
                         };

            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;
            loadOptions.RequireTotalCount = true;

            return await DataSourceLoader.LoadAsync(source, loadOptions);
        }
        //public DeclarationSearchResponseVM Search(DeclarationSearchRequestVM request)
        //{
        //    var query = _datenbankContext.Declarations.AsQueryable();
        //    if (!string.IsNullOrEmpty(request.SearchTerm))
        //    {
        //        query = query.Where(x =>
        //            !string.IsNullOrEmpty(x.Name) && !string.IsNullOrEmpty(request.SearchTerm) && x.Name.ToLower().Contains(request.SearchTerm.ToLower()) ||
        //            !string.IsNullOrEmpty(x.Vorname) && !string.IsNullOrEmpty(request.SearchTerm) && x.Vorname.ToLower().Contains(request.SearchTerm.ToLower())
        //        );
        //    }
        //    var totalCount = query.Count();

        //    query = query.Skip(request.Skip).Take(request.Take);

        //    var result = query.Select(x => new DeclarationItemVM
        //    {
        //        Id = x.Id,
        //        Name = x.Name,
        //        Vorname = x.Vorname,
        //        Anrede = x.Anrede,
        //        Geburtsdatum = x.Geburtsdatum.ToAngularString(),
        //        GeborenIn = x.GeborenIn,
        //        Strasse = x.Strasse,
        //        Plz = x.Plz,
        //        Ort = x.Ort,
        //        //Signature = x.Signagture != null ? new SignatureItemVM
        //        //{
        //        //    Id = x.Signagture.Id,
        //        //    Data = x.Signagture.Data,
        //        //    Date = x.Signagture.Date,
        //        //    Hash = x.Signagture.Hash,
        //        //    Image = x.Signagture.Image,
        //        //    Points = x.Signagture.Points,
        //        //} : null
        //    }
        //         ).ToList();

        //    return new DeclarationSearchResponseVM
        //    {
        //        Items = result,
        //        TotalCount = totalCount,
        //    };
        //}

        public List<DeclarationItemVM> GetAll()
        {
            //var _S = _datenbankContext.Declarations.Include(x => x.Signagture).FirstOrDefault();
            //if ((_S != null))
            //{
            //    _S.Signagture!.Declaration = null;
            //    _S.Signagture!.DeclarationId = null;
            //    var tmp = JsonConvert.SerializeObject(_S);
            //    File.WriteAllText(@"c:\temp\signature.json", tmp, Encoding.UTF8);
            //}




            var result = _datenbankContext.Declarations.Select(x => new DeclarationItemVM
            {
                Id = x.Id,
                Name = x.Name,
                Vorname = x.Vorname,
                Anrede = x.Geschlecht,
                Geburtsdatum = x.Geburtsdatum.ToAngularString(),
                GeborenIn = x.GeborenIn,
                Strasse = x.Strasse,
                Hasunummer = x.Hasunummer,
                Plz = x.Plz,
                Ort = x.Ort,
                Signature = x.Signagture != null ? new SignatureItemVM
                {
                    Id = x.Signagture.Id,
                    Date = x.Signagture.Date,
                    Hash = x.Signagture.Hash,
                    Image = x.Signagture.Image,
                    Points = x.Signagture.Points,
                    PointerTypes = x.Signagture.PointerTypes,
                } : null
            }).ToList();

            return result;
        }

        public long? Add(DeclarationItemAddVM request)
        {
            Declaration? declaration = null;

            if (request.Id.HasValue)
            {
                declaration = _datenbankContext.Declarations.Find(request.Id.Value);
                if (declaration != null)
                {
                    declaration.Name = request.Name;
                    declaration.Vorname = request.Vorname;
                    declaration.Geschlecht = request.Geschlecht;
                    declaration.Geburtsdatum = request.Geburtsdatum; //.HasValue ? request.Geburtsdatum.Value.ToNullableDateTime() : null;
                    declaration.GeborenIn = request.GeborenIn;
                    declaration.Strasse = request.Strasse;
                    declaration.Hasunummer = request.Hausnummer;
                    declaration.Plz = request.Plz;
                    declaration.Ort = request.Ort;
                    declaration.Signagture = request.Signature != null ? new Signature
                    {
                        Hash = request.Signature.Hash,
                        Date = request.Signature.Date,
                        Image = request.Signature.Image,
                        Points = request.Signature.Points,
                        PointerTypes = request.Signature.PointerTypes,
                    } : null;

                    if (declaration.Signagture != null)
                    {
                        declaration.Signagture.Declaration = declaration;
                    }

                    _datenbankContext.Update(declaration);
                }
            }
            else
            {
                declaration = new Declaration
                {
                    Name = request.Name,
                    Vorname = request.Vorname,
                    Geschlecht = request.Geschlecht,
                    Geburtsdatum = request.Geburtsdatum, //.HasValue ? request.Geburtsdatum.Value.ToNullableDateTime() : null,
                    GeborenIn = request.GeborenIn,
                    Strasse = request.Strasse,
                    Hasunummer = request.Hausnummer,
                    Plz = request.Plz,
                    Ort = request.Ort,
                    Signagture = request.Signature != null ? new Signature
                    {
                        Hash = request.Signature.Hash,
                        Date = request.Signature.Date,
                        Image = request.Signature.Image,
                        Points = request.Signature.Points,
                        PointerTypes = request.Signature.PointerTypes,
                    } : null
                };

                if (declaration.Signagture != null)
                {
                    declaration.Signagture.Declaration = declaration;
                }

                _datenbankContext.Add(declaration);
            };

            _datenbankContext.SaveChanges();

            return declaration?.Id;
        }

    }
}
