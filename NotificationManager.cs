using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Extensions.Logging;
using Windows.UI.Notifications;
using Windows.Data.Xml.Dom;

namespace NotificationCenter.Service
{
    public class NotificationManager
    {
        private readonly ILogger<NotificationManager> _logger;
        private readonly ApiClient _apiClient;
        private readonly DatabaseManager _database;
        private readonly List<NotificationItem> _notifications;

        public event EventHandler<NotificationEventArgs> NotificationReceived;
        public event EventHandler<NotificationEventArgs> NotificationUpdated;

        public NotificationManager(ILogger<NotificationManager> logger, ApiClient apiClient, DatabaseManager database)
        {
            _logger = logger;
            _apiClient = apiClient;
            _database = database;
            _notifications = new List<NotificationItem>();
        }

        public void Initialize()
        {
            _logger.LogInformation("Инициализация менеджера уведомлений");
            LoadNotificationsFromDatabase();
        }

        public async Task CheckForNewNotificationsAsync()
        {
            try
            {
                var newNotifications = await _apiClient.GetNewNotificationsAsync();
                
                foreach (var notification in newNotifications)
                {
                    await ProcessNewNotification(notification);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении новых уведомлений");
            }
        }

        private async Task ProcessNewNotification(NotificationItem notification)
        {
            // Сохранение в базу данных
            await _database.SaveNotificationAsync(notification);
            
            // Добавление в локальный список
            _notifications.Insert(0, notification);
            
            // Показ системного уведомления Windows
            ShowWindowsNotification(notification);
            
            // Уведомление UI
            NotificationReceived?.Invoke(this, new NotificationEventArgs(notification));
            
            _logger.LogInformation($"Получено новое уведомление: {notification.Title}");
        }

        private void ShowWindowsNotification(NotificationItem notification)
        {
            try
            {
                var toastXml = ToastNotificationManager.GetTemplateContent(ToastTemplateType.ToastText02);
                var stringElements = toastXml.GetElementsByTagName("text");
                
                stringElements[0].AppendChild(toastXml.CreateTextNode(notification.Title));
                stringElements[1].AppendChild(toastXml.CreateTextNode(notification.Message));

                var toast = new ToastNotification(toastXml);
                toast.Activated += (sender, args) => OnToastActivated(notification);
                
                ToastNotificationManager.CreateToastNotifier("NotificationCenter").Show(toast);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при показе Windows уведомления");
            }
        }

        private void OnToastActivated(NotificationItem notification)
        {
            // Открытие главного окна при клике на уведомление
            NotificationUpdated?.Invoke(this, new NotificationEventArgs(notification));
        }

        public List<NotificationItem> GetAllNotifications()
        {
            return new List<NotificationItem>(_notifications);
        }

        public async Task MarkAsReadAsync(string notificationId)
        {
            var notification = _notifications.Find(n => n.Id == notificationId);
            if (notification != null)
            {
                notification.IsRead = true;
                await _database.UpdateNotificationAsync(notification);
                NotificationUpdated?.Invoke(this, new NotificationEventArgs(notification));
            }
        }

        public async Task ProcessActionAsync(string notificationId, string action, string response = null)
        {
            var notification = _notifications.Find(n => n.Id == notificationId);
            if (notification != null)
            {
                notification.Status = action;
                notification.Response = response;
                notification.ProcessedAt = DateTime.Now;
                
                await _database.UpdateNotificationAsync(notification);
                await _apiClient.SendActionResponseAsync(notificationId, action, response);
                
                NotificationUpdated?.Invoke(this, new NotificationEventArgs(notification));
                
                _logger.LogInformation($"Обработано действие '{action}' для уведомления {notificationId}");
            }
        }

        private void LoadNotificationsFromDatabase()
        {
            try
            {
                var notifications = _database.GetRecentNotifications(100);
                _notifications.AddRange(notifications);
                _logger.LogInformation($"Загружено {notifications.Count} уведомлений из базы данных");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при загрузке уведомлений из базы данных");
            }
        }
    }

    public class NotificationEventArgs : EventArgs
    {
        public NotificationItem Notification { get; }

        public NotificationEventArgs(NotificationItem notification)
        {
            Notification = notification;
        }
    }
}
