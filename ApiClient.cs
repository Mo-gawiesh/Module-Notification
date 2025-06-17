using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace NotificationCenter.Service
{
    public class ApiClient
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<ApiClient> _logger;
        private readonly string _baseUrl;
        private readonly string _apiKey;

        public ApiClient(ILogger<ApiClient> logger)
        {
            _logger = logger;
            _baseUrl = System.Configuration.ConfigurationManager.AppSettings["ApiBaseUrl"] ?? "https://your-company-api.com";
            _apiKey = System.Configuration.ConfigurationManager.AppSettings["ApiKey"] ?? "";

            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "NotificationCenter/1.0");
        }

        public async Task<List<NotificationItem>> GetNewNotificationsAsync()
        {
            try
            {
                var employeeId = Environment.UserName; // Или получить из настроек
                var response = await _httpClient.GetAsync($"{_baseUrl}/api/notifications/new?employeeId={employeeId}");
                
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var notifications = JsonSerializer.Deserialize<List<NotificationItem>>(json, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    
                    return notifications ?? new List<NotificationItem>();
                }
                else
                {
                    _logger.LogWarning($"API вернул статус {response.StatusCode}");
                    return new List<NotificationItem>();
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Ошибка сети при получении уведомлений");
                return new List<NotificationItem>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении уведомлений из API");
                return new List<NotificationItem>();
            }
        }

        public async Task<bool> SendActionResponseAsync(string notificationId, string action, string response = null)
        {
            try
            {
                var payload = new
                {
                    NotificationId = notificationId,
                    Action = action,
                    Response = response,
                    ProcessedBy = Environment.UserName,
                    ProcessedAt = DateTime.Now
                };

                var json = JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var httpResponse = await _httpClient.PostAsync($"{_baseUrl}/api/notifications/action", content);
                
                if (httpResponse.IsSuccessStatusCode)
                {
                    _logger.LogInformation($"Действие '{action}' успешно отправлено для уведомления {notificationId}");
                    return true;
                }
                else
                {
                    _logger.LogWarning($"Ошибка при отправке действия: {httpResponse.StatusCode}");
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при отправке действия в API");
                return false;
            }
        }

        public async Task<bool> RegisterEmployeeAsync(string employeeId, string computerName)
        {
            try
            {
                var payload = new
                {
                    EmployeeId = employeeId,
                    ComputerName = computerName,
                    LastSeen = DateTime.Now,
                    ServiceVersion = "1.0.0"
                };

                var json = JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync($"{_baseUrl}/api/employees/register", content);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при регистрации сотрудника");
                return false;
            }
        }

        public void Dispose()
        {
            _httpClient?.Dispose();
        }
    }
}
