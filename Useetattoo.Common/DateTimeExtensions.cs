using System.Text.Json;

namespace Useetattoo.Common
{
    public static class DateTimeExtensions
    {
        public static DateTime? ToNullableDateTime(this JsonElement jsonElement)
        {
            if(jsonElement.ValueKind == JsonValueKind.Object)
            {
                var day = jsonElement.GetProperty("day").GetInt32();
                var month = jsonElement.GetProperty("month").GetInt32();
                var year = jsonElement.GetProperty("year").GetInt32();
                return new DateTime(year, month, day);
            }
            return null;
        }

        public static string? ToAngularString(this DateTime? dateTime)
        {
            return dateTime?.ToString("dd.MM.yyyy");
        }
    }
}
