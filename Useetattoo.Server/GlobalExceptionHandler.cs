﻿//using Microsoft.AspNetCore.Diagnostics;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.WebUtilities;
//using System.Text.Json;
//using System.Text.Json.Serialization;

//// "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=Useetattoo;Trusted_Connection=True;MultipleActiveResultSets=true"
//// "DefaultConnection": "data source=.;AttachDbFileName=Useetattoo.mdf ;Database=Useetattoo;Trusted_Connection=True;MultipleActiveResultSets=true"
////  @"data source=.;AttachDbFileName=d:\data\yourDBname.mdf ;initial catalog=yourDBname;persist security info=True;user id=sa;password=1234;MultipleActiveResultSets=True;App=EntityFramework");
//namespace Useetattoo.Server
//{
//    public class GlobalExceptionHandler(IHostEnvironment env, ILogger<GlobalExceptionHandler> logger)
//    : IExceptionHandler
//    {
//        private const string UnhandledExceptionMsg = "An unhandled exception has occurred while executing the request.";

//        private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web)
//        {
//            Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) }
//        };

//        public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception,
//            CancellationToken cancellationToken)
//        {
//            exception.AddErrorCode();

//            //If your logger logs DiagnosticsTelemetry, you should remove the string below to avoid the exception being logged twice.
//            logger.LogError(exception, exception is YourAppException ? exception.Message : UnhandledExceptionMsg);

//            var problemDetails = CreateProblemDetails(context, exception);
//            var json = ToJson(problemDetails);

//            const string contentType = "application/problem+json";
//            context.Response.ContentType = contentType;
//            await context.Response.WriteAsync(json, cancellationToken);

//            return true;
//        }

//        private ProblemDetails CreateProblemDetails(in HttpContext context, in Exception exception)
//        {
//            var errorCode = exception.GetErrorCode();
//            var statusCode = context.Response.StatusCode;
//            var reasonPhrase = ReasonPhrases.GetReasonPhrase(statusCode);
//            if (string.IsNullOrEmpty(reasonPhrase))
//            {
//                reasonPhrase = UnhandledExceptionMsg;
//            }

//            var problemDetails = new ProblemDetails
//            {
//                Status = statusCode,
//                Title = reasonPhrase,
//                Extensions =
//            {
//                [nameof(errorCode)] = errorCode
//            }
//            };

//            if (!env.IsDevelopment())
//            {
//                return problemDetails;
//            }

//            problemDetails.Detail = exception.ToString();
//            problemDetails.Extensions["traceId"] = context.TraceIdentifier;
//            problemDetails.Extensions["data"] = exception.Data;

//            return problemDetails;
//        }

//        private string ToJson(in ProblemDetails problemDetails)
//        {
//            try
//            {
//                return JsonSerializer.Serialize(problemDetails, SerializerOptions);
//            }
//            catch (Exception ex)
//            {
//                const string msg = "An exception has occurred while serializing error to JSON";
//                logger.LogError(ex, msg);
//            }

//            return string.Empty;
//        }
//    }
//}