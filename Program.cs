using System;
using System.Drawing;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Collections.Generic;
using System.Linq;

namespace NotificationCenter
{
    public class Program
    {
        [STAThread]
        public static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            
            Console.WriteLine("Starting Modern Notification Center...");
            
            var app = new ModernNotificationApp();
            app.Start();
            
            Application.Run();
        }
    }

    public class ModernNotificationApp
    {
        private NotifyIcon trayIcon;
        private ContextMenuStrip contextMenu;
        private ModernMainForm mainForm;
        private List<NotificationItem> notifications;
        private System.Windows.Forms.Timer notificationTimer;

        public void Start()
        {
            notifications = new List<NotificationItem>();
            CreateTrayIcon();
            StartNotificationTimer();
            AddSampleNotifications();
        }

        private void CreateTrayIcon()
        {
            contextMenu = new ContextMenuStrip();
            contextMenu.Items.Add("Открыть центр уведомлений", null, OpenMainWindow);
            contextMenu.Items.Add("-");
            contextMenu.Items.Add("Выход", null, ExitApplication);

            trayIcon = new NotifyIcon()
            {
                Icon = CreateModernIcon(),
                Text = "Центр уведомлений",
                ContextMenuStrip = contextMenu,
                Visible = true
            };

            trayIcon.DoubleClick += (s, e) => OpenMainWindow(s, e);
        }

        private Icon CreateModernIcon()
        {
            var bitmap = new Bitmap(32, 32);
            using (var g = Graphics.FromImage(bitmap))
            {
                g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
                g.Clear(Color.Transparent);
                
                // Teal circle background
                g.FillEllipse(new SolidBrush(Color.FromArgb(26, 188, 156)), 2, 2, 28, 28);
                
                // White bell icon
                g.DrawString("🔔", new Font("Segoe UI Emoji", 16), Brushes.White, 6, 4);
                
                // Red notification dot
                if (notifications.Any(n => n.IsNew))
                {
                    g.FillEllipse(new SolidBrush(Color.FromArgb(231, 76, 60)), 20, 4, 10, 10);
                }
            }
            return Icon.FromHandle(bitmap.GetHicon());
        }

        private void AddSampleNotifications()
        {
            notifications.AddRange(new[]
            {
                new NotificationItem
                {
                    Title = "Автоматическое уведомление",
                    Message = "Новое уведомление получено автоматически для сотрудника",
                    Type = NotificationType.Info,
                    Department = "Система",
                    Time = "01:20",
                    IsNew = true
                },
                new NotificationItem
                {
                    Title = "Отключение воды",
                    Message = "В связи с плановыми работами будет отключена горячая вода с 10:00 до 15:00",
                    Type = NotificationType.Warning,
                    Department = "ЖКХ",
                    Time = "23:54",
                    IsNew = true
                },
                new NotificationItem
                {
                    Title = "Собрание жильцов",
                    Message = "Обсуждение новых тарифов на коммунальные услуги",
                    Type = NotificationType.Info,
                    Department = "Управление",
                    Time = "23:50",
                    IsNew = true
                }
            });
        }

        private void StartNotificationTimer()
        {
            notificationTimer = new System.Windows.Forms.Timer();
            notificationTimer.Interval = 30000;
            notificationTimer.Tick += (s, e) => AddAutomaticNotification();
            notificationTimer.Start();
        }

        private void AddAutomaticNotification()
        {
            var notification = new NotificationItem
            {
                Title = "Автоматическое уведомление",
                Message = $"Новое уведомление получено в {DateTime.Now:HH:mm}",
                Type = NotificationType.Info,
                Department = "Система",
                Time = DateTime.Now.ToString("HH:mm"),
                IsNew = true
            };

            notifications.Insert(0, notification);
            
            trayIcon.ShowBalloonTip(3000, notification.Title, notification.Message, ToolTipIcon.Info);
            UpdateTrayIcon();
        }

        private void UpdateTrayIcon()
        {
            trayIcon.Icon?.Dispose();
            trayIcon.Icon = CreateModernIcon();
            
            int newCount = notifications.Count(n => n.IsNew);
            trayIcon.Text = newCount > 0 ? $"Центр уведомлений - {newCount} новых" : "Центр уведомлений";
        }

        private void OpenMainWindow(object sender, EventArgs e)
        {
            if (mainForm == null || mainForm.IsDisposed)
            {
                mainForm = new ModernMainForm(notifications);
            }

            mainForm.Show();
            mainForm.WindowState = FormWindowState.Normal;
            mainForm.BringToFront();
            mainForm.Activate();

            foreach (var notification in notifications)
            {
                notification.IsNew = false;
            }
            UpdateTrayIcon();
        }

        private void ExitApplication(object sender, EventArgs e)
        {
            trayIcon.Visible = false;
            Application.Exit();
        }
    }

    public class NotificationItem
    {
        public string Title { get; set; }
        public string Message { get; set; }
        public NotificationType Type { get; set; }
        public string Department { get; set; }
        public string Time { get; set; }
        public bool IsNew { get; set; }
    }

    public enum NotificationType
    {
        Info,
        Warning,
        Error,
        Success
    }
}
