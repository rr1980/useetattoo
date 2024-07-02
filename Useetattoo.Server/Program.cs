
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualBasic;
using System.Text;
using Useetattoo.Db;

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
                if (connstr.Contains("%CONTENTROOTPATH%"))
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
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                };
            });

            var app = builder.Build();

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

            CreateDbIfNotExists(app, builder.Configuration["Salt"]);
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