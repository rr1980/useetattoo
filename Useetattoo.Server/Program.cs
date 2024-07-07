
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualBasic;
using Newtonsoft.Json;
using System.Reflection;
using System.Text;
using Useetattoo.Db;
using Useetattoo.Services;
using Useetattoo.Services.Interfaces;
using static System.Runtime.InteropServices.JavaScript.JSType;

// "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=Useetattoo;Trusted_Connection=True;MultipleActiveResultSets=true"
// "DefaultConnection": "data source=.;AttachDbFileName=Useetattoo.mdf ;Database=Useetattoo;Trusted_Connection=True;MultipleActiveResultSets=true"
//  @"data source=.;AttachDbFileName=d:\data\yourDBname.mdf ;initial catalog=yourDBname;persist security info=True;user id=sa;password=1234;MultipleActiveResultSets=True;App=EntityFramework");
namespace Useetattoo.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddDbContext<DatenbankContext>(options =>
            {
                var connstr = builder.Configuration.GetConnectionString("DefaultConnection");
                if (!string.IsNullOrEmpty(connstr) && connstr.Contains("%CONTENTROOTPATH%"))
                {
                    connstr = connstr.Replace("%CONTENTROOTPATH%", builder.Environment.ContentRootPath);
                }
                options.UseSqlServer(connstr, builder =>
                {
                    builder.MigrationsAssembly(typeof(DatenbankContext).Assembly.FullName);
                    builder.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                });
                options.EnableSensitiveDataLogging();
            });
            //builder.Services.AddDatabaseDeveloperPageExceptionFilter();

            //var builder = WebApplication.CreateBuilder(new WebApplicationOptions() { WebRootPath = "wwwroot/browser" });

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddHttpContextAccessor();

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
                };
            });

            //builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IDeclarationService, DeclarationService>();

            var app = builder.Build();
            app.UseExceptionHandler(opt => opt.Run(async ctx =>
            {
                var feature = ctx.Features.Get<IExceptionHandlerFeature>();

                var result = JsonConvert.SerializeObject(new
                {
                    status = 500,
                    title = "An error occurred while processing your request.",
                    traceId = "123",
                    type = ""
                });

                if (feature != null)
                {

                    result = JsonConvert.SerializeObject(new
                    {
                        status = ctx.Response.StatusCode,
                        title = feature.Error.Message, // "An error occurred while processing your request.",
                        traceId = ctx.TraceIdentifier,
                        type = feature?.Error.GetType().Name
                    });
                }



                ctx.Response.ContentType = "application/json";


                await ctx.Response.WriteAsync(result);
                //if (feature.Error is InvalidStringException ex)
                //{
                //    await ctx.Response.WriteAsync(ex.Message);
                //}


                //            {
                //                "headers": {
                //                    "normalizedNames": { },
                //                    "lazyUpdate": null
                //                                },
                //                "status": 401,
                //                "statusText": "Unauthorized",
                //                "url": "https://127.0.0.1:4200/Api/Declaration/Test",
                //                "ok": false,
                //                "name": "HttpErrorResponse",
                //                "message": "Http failure response for https://127.0.0.1:4200/Api/Declaration/Test: 401 Unauthorized",
                //                "error": {
                //                    "type": "https://tools.ietf.org/html/rfc9110#section-15.5.2",
                //                "title": "Unauthorized",
                //                "status": 401,
                //                "traceId": "00-c2d374e89ad7bcbde8c099ef6fa91f34-a042f361251efb23-00"
                //}
                //            }

            }));
            app.UseMiddleware<RequestLoggingMiddleware>();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            //if (!env.IsDevelopment())
            //{
            //}


            // Configure the HTTP request pipeline.
            //if (app.Environment.IsDevelopment())
            //{
            app.UseSwagger();
            app.UseSwaggerUI();
            //app.UseSpaStaticFiles();

            //}
            app.UseRouting();

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            CreateDbIfNotExists(app, builder.Configuration["Salt"] ?? "7O123KYwvrAyGpudfdgTTZsoGPDqTKrFUPsiV3Ot");
            app.Run();
        }

        private static void CreateDbIfNotExists(WebApplication app, string salt)
        {
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<DatenbankContext>();
                    DbInitializer.Initialize(context, salt);
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occurred creating the DB.");
                }
            }
        }
    }
}