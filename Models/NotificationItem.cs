using System;
using System.ComponentModel.DataAnnotations;

namespace NotificationCenter.Service
{
    public class NotificationItem
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string Title { get; set; }
        
        [Required]
        public string Message { get; set; }
        
        public NotificationType Type { get; set; } = NotificationType.Info;
        
        public NotificationPriority Priority { get; set; } = NotificationPriority.Medium;
        
        public string Department { get; set; }
        
        public string Category { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        public DateTime? ProcessedAt { get; set; }
        
        public bool IsRead { get; set; } = false;
        
        public bool ActionRequired { get; set; } = false;
        
        public string Status { get; set; } = "New";
        
        public string Response { get; set; }
        
        public string EmployeeId { get; set; }
        
        public string AssignedTo { get; set; }
        
        public DateTime? DueDate { get; set; }
        
        public string AttachmentPath { get; set; }
        
        public string SourceSystem { get; set; }
        
        public int RetryCount { get; set; } = 0;
        
        public DateTime? LastRetryAt { get; set; }
    }

    public enum NotificationType
    {
        Info,
        Warning,
        Error,
        Success
    }

    public enum NotificationPriority
    {
        Low,
        Medium,
        High,
        Critical
    }
}
