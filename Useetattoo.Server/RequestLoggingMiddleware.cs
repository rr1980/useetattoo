// "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=Useetattoo;Trusted_Connection=True;MultipleActiveResultSets=true"
// "DefaultConnection": "data source=.;AttachDbFileName=Useetattoo.mdf ;Database=Useetattoo;Trusted_Connection=True;MultipleActiveResultSets=true"
//  @"data source=.;AttachDbFileName=d:\data\yourDBname.mdf ;initial catalog=yourDBname;persist security info=True;user id=sa;password=1234;MultipleActiveResultSets=True;App=EntityFramework");
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text;

namespace Useetattoo.Server
{
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;
        private readonly bool _hasRequestToLog = false;
        private readonly bool _hasResponseToLog = false;
        private readonly bool _hasRequestToLogAdvanced = false;
        private readonly bool _hasResponseToLogAdvanced = false;

        public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger, IConfiguration configuration)
        {
            _next = next;
            _logger = logger;
            _configuration = configuration;
            _hasRequestToLog = configuration.GetValue<bool>("LoggingRequest");
            _hasResponseToLog = configuration.GetValue<bool>("LoggingResponse");
            _hasRequestToLogAdvanced = configuration.GetValue<bool>("LoggingRequestAdvanced");
            _hasResponseToLogAdvanced = configuration.GetValue<bool>("LoggingResponseAdvanced");
        }

        public async Task Invoke(HttpContext context)
        {
            Stream? originalBody;
            string responseBody = "";

            if (_hasResponseToLog && _hasResponseToLogAdvanced == true)
            {
                originalBody = context.Response.Body;
            }
            else
            {
                originalBody = null;
            }

            try
            {
                if (_hasRequestToLog == true)
                {
                    if (_hasRequestToLogAdvanced == true)
                    {
                        var rawRequestBody = await context.Request.GetRawBodyAsync();
                        if (!string.IsNullOrEmpty(rawRequestBody))
                        {
                            _logger.LogInformation(
                                "Request {method} {url} => {rawRequestBody}",
                                context.Request?.Method,
                                context.Request?.Path.Value,
                                rawRequestBody);
                        }
                    }
                    else
                    {
                        _logger.LogInformation(
                                      "Request {method} {url} => {rawRequestBody}",
                                      context.Request?.Method,
                                      context.Request?.Path.Value);
                    }
                }
  

                if (_hasResponseToLog && _hasResponseToLogAdvanced == true && originalBody != null)
                {
                    using (var memStream = new MemoryStream())
                    {
                        context.Response.Body = memStream;

                        await _next(context);

                        memStream.Position = 0;
                        responseBody = new StreamReader(memStream).ReadToEnd();

                        memStream.Position = 0;
                        await memStream.CopyToAsync(originalBody);
                    }
                }
                else
                {
                    await _next(context);
                }
            }
            finally
            {
                if (_hasResponseToLog && _hasResponseToLogAdvanced == true && originalBody != null)
                {
                    context.Response.Body = originalBody;

                    _logger.LogInformation(
                        "Response {method} {url} => {statusCode} => {responseBody}",
                        context.Request?.Method,
                        context.Request?.Path.Value,
                        context.Response?.StatusCode,
                        responseBody);
                }
                else if (_hasResponseToLog && _hasResponseToLogAdvanced != true)
                {
                    _logger.LogInformation(
                        "Response {method} {url} => {statusCode}",
                        context.Request?.Method,
                        context.Request?.Path.Value,
                        context.Response?.StatusCode);
                }
            }
        }
    }

    public static class RequestReaderHelper
    {
        public static async Task<string> GetRawBodyAsync(this HttpRequest request, Encoding? encoding = null)
        {
            if (!request.Body.CanSeek)
            {
                request.EnableBuffering();
            }

            request.Body.Position = 0;

            var reader = new StreamReader(request.Body, encoding ?? Encoding.UTF8);

            var body = await reader.ReadToEndAsync().ConfigureAwait(false);

            request.Body.Position = 0;

            string result = "";

            if (!string.IsNullOrEmpty(body))
            {
                JToken token = JToken.Parse(body);
                string[] jsonPaths = new[] { "AuthToken", "FileContent", "fileContent", "authToken", "Token", "Username", "UserName", "Benutzername", "BenutzerName", "Password", "password", "Name", "name", "Vorname", "VorName", "vorname", "Geburtsdatum", "GeburtsDatum", "geburtsdatum" };
                ObscureMatchingValues2(new List<JToken> { token }, jsonPaths);
                result = token.ToString(Formatting.None);
            }

            return result;

        }

        public static string Obscure(string s)
        {
            if (string.IsNullOrEmpty(s)) return s;
            return "***";
        }

        public static void ObscureMatchingValues(JToken token, IEnumerable<string> jsonPaths)
        {
            foreach (string path in jsonPaths)
            {
                foreach (JToken match in token.SelectTokens(path))
                {
                    match.Replace(new JValue(Obscure(match.ToString())));
                }
            }
        }

        public static void ObscureMatchingValues2(IEnumerable<JToken> tokens, IEnumerable<string> jsonPaths)
        {
            foreach (var token in tokens)
            {
                if (token.Children().Any())
                {
                    foreach (string path in jsonPaths)
                    {
                        foreach (JToken match in token.SelectTokens(path))
                        {
                            match.Replace(new JValue(Obscure(match.ToString())));
                        }
                    }

                    ObscureMatchingValues2(token.Children(), jsonPaths);
                }
                else
                {
                    foreach (string path in jsonPaths)
                    {
                        foreach (JToken match in token.SelectTokens(path))
                        {
                            match.Replace(new JValue(Obscure(match.ToString())));
                        }
                    }
                }
            }
        }
    }
}