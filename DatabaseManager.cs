using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace NotificationCenter.Service
{
    public class DatabaseManager
    {
        private readonly ILogger<DatabaseManager> _logger;
        private readonly string _connectionString;
        private readonly string _databasePath;

        public DatabaseManager(ILogger<DatabaseManager> logger)
        {
            _logger = logger;
            _databasePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), 
                                       "NotificationCenter", "notifications.db");
            _connectionString = $"Data Source={_databasePath};Version=3;";
            
            InitializeDatabase();
        }

        private void InitializeDatabase()
        {
            try
            {
                var directory = Path.GetDirectoryName(_databasePath);
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                if (!File.Exists(_databasePath))
                {
                    SQLiteConnection.CreateFile(_databasePath);
                    CreateTables();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при инициализации базы данных");
                throw;
            }
        }

        private void CreateTables()
        {
            using var connection = new SQLiteConnection(_connectionString);
            connection.Open();

            var createTableSql = @"
                CREATE TABLE IF NOT EXISTS Notifications (
                    Id TEXT PRIMARY KEY,
                    Title TEXT NOT NULL,
                    Message TEXT NOT NULL,
                    Type INTEGER NOT NULL,
                    Priority INTEGER NOT NULL,
                    Department TEXT,
                    Category TEXT,
                    CreatedAt DATETIME NOT NULL,
                    ProcessedAt DATETIME,
                    IsRead BOOLEAN NOT NULL DEFAULT 0,
                    ActionRequired BOOLEAN NOT NULL DEFAULT 0,
                    Status TEXT NOT NULL DEFAULT 'New',
                    Response TEXT,
                    EmployeeId TEXT,
                    AssignedTo TEXT,
                    DueDate DATETIME,
                    AttachmentPath TEXT,
                    SourceSystem TEXT,
                    RetryCount INTEGER NOT NULL DEFAULT 0,
                    LastRetryAt DATETIME
                );

                CREATE INDEX IF NOT EXISTS IX_Notifications_CreatedAt ON Notifications(CreatedAt);
                CREATE INDEX IF NOT EXISTS IX_Notifications_EmployeeId ON Notifications(EmployeeId);
                CREATE INDEX IF NOT EXISTS IX_Notifications_IsRead ON Notifications(IsRead);
            ";

            using var command = new SQLiteCommand(createTableSql, connection);
            command.ExecuteNonQuery();

            _logger.LogInformation("Таблицы базы данных созданы");
        }

        public async Task SaveNotificationAsync(NotificationItem notification)
        {
            try
            {
                using var connection = new SQLiteConnection(_connectionString);
                await connection.OpenAsync();

                var sql = @"
                    INSERT OR REPLACE INTO Notifications 
                    (Id, Title, Message, Type, Priority, Department, Category, CreatedAt, ProcessedAt, 
                     IsRead, ActionRequired, Status, Response, EmployeeId, AssignedTo, DueDate, 
                     AttachmentPath, SourceSystem, RetryCount, LastRetryAt)
                    VALUES 
                    (@Id, @Title, @Message, @Type, @Priority, @Department, @Category, @CreatedAt, @ProcessedAt,
                     @IsRead, @ActionRequired, @Status, @Response, @EmployeeId, @AssignedTo, @DueDate,
                     @AttachmentPath, @SourceSystem, @RetryCount, @LastRetryAt)";

                using var command = new SQLiteCommand(sql, connection);
                AddNotificationParameters(command, notification);
                await command.ExecuteNonQueryAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Ошибка при сохранении уведомления {notification.Id}");
                throw;
            }
        }

        public async Task UpdateNotificationAsync(NotificationItem notification)
        {
            await SaveNotificationAsync(notification); // INSERT OR REPLACE
        }

        public List<NotificationItem> GetRecentNotifications(int count = 100)
        {
            var notifications = new List<NotificationItem>();

            try
            {
                using var connection = new SQLiteConnection(_connectionString);
                connection.Open();

                var sql = @"
                    SELECT * FROM Notifications 
                    ORDER BY CreatedAt DESC 
                    LIMIT @Count";

                using var command = new SQLiteCommand(sql, connection);
                command.Parameters.AddWithValue("@Count", count);

                using var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    notifications.Add(MapNotificationFromReader(reader));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении уведомлений из базы данных");
            }

            return notifications;
        }

        public List<NotificationItem> GetUnreadNotifications()
        {
            var notifications = new List<NotificationItem>();

            try
            {
                using var connection = new SQLiteConnection(_connectionString);
                connection.Open();

                var sql = "SELECT * FROM Notifications WHERE IsRead = 0 ORDER BY CreatedAt DESC";

                using var command = new SQLiteCommand(sql, connection);
                using var reader = command.ExecuteReader();
                
                while (reader.Read())
                {
                    notifications.Add(MapNotificationFromReader(reader));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении непрочитанных уведомлений");
            }

            return notifications;
        }

        private void AddNotificationParameters(SQLiteCommand command, NotificationItem notification)
        {
            command.Parameters.AddWithValue("@Id", notification.Id);
            command.Parameters.AddWithValue("@Title", notification.Title);
            command.Parameters.AddWithValue("@Message", notification.Message);
            command.Parameters.AddWithValue("@Type", (int)notification.Type);
            command.Parameters.AddWithValue("@Priority", (int)notification.Priority);
            command.Parameters.AddWithValue("@Department", notification.Department ?? "");
            command.Parameters.AddWithValue("@Category", notification.Category ?? "");
            command.Parameters.AddWithValue("@CreatedAt", notification.CreatedAt);
            command.Parameters.AddWithValue("@ProcessedAt", notification.ProcessedAt);
            command.Parameters.AddWithValue("@IsRead", notification.IsRead);
            command.Parameters.AddWithValue("@ActionRequired", notification.ActionRequired);
            command.Parameters.AddWithValue("@Status", notification.Status);
            command.Parameters.AddWithValue("@Response", notification.Response ?? "");
            command.Parameters.AddWithValue("@EmployeeId", notification.EmployeeId ?? "");
            command.Parameters.AddWithValue("@AssignedTo", notification.AssignedTo ?? "");
            command.Parameters.AddWithValue("@DueDate", notification.DueDate);
            command.Parameters.AddWithValue("@AttachmentPath", notification.AttachmentPath ?? "");
            command.Parameters.AddWithValue("@SourceSystem", notification.SourceSystem ?? "");
            command.Parameters.AddWithValue("@RetryCount", notification.RetryCount);
            command.Parameters.AddWithValue("@LastRetryAt", notification.LastRetryAt);
        }

        private NotificationItem MapNotificationFromReader(SQLiteDataReader reader)
        {
            return new NotificationItem
            {
                Id = reader["Id"].ToString(),
                Title = reader["Title"].ToString(),
                Message = reader["Message"].ToString(),
                Type = (NotificationType)Convert.ToInt32(reader["Type"]),
                Priority = (NotificationPriority)Convert.ToInt32(reader["Priority"]),
                Department = reader["Department"].ToString(),
                Category = reader["Category"].ToString(),
                CreatedAt = Convert.ToDateTime(reader["CreatedAt"]),
                ProcessedAt = reader["ProcessedAt"] as DateTime?,
                IsRead = Convert.ToBoolean(reader["IsRead"]),
                ActionRequired = Convert.ToBoolean(reader["ActionRequired"]),
                Status = reader["Status"].ToString(),
                Response = reader["Response"].ToString(),
                EmployeeId = reader["EmployeeId"].ToString(),
                AssignedTo = reader["AssignedTo"].ToString(),
                DueDate = reader["DueDate"] as DateTime?,
                AttachmentPath = reader["AttachmentPath"].ToString(),
                SourceSystem = reader["SourceSystem"].ToString(),
                RetryCount = Convert.ToInt32(reader["RetryCount"]),
                LastRetryAt = reader["LastRetryAt"] as DateTime?
            };
        }
    }
}
