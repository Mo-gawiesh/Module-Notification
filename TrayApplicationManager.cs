using System;
using System.Drawing;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Extensions.Logging;

namespace NotificationCenter.Service
{
    public class TrayApplicationManager
    {
        private readonly ILogger<TrayApplicationManager> _logger;
        private readonly NotificationManager _notificationManager;
        private NotifyIcon _trayIcon;
        private ContextMenuStrip _contextMenu;
        private MainForm _mainForm;
        private bool _isRunning = false;
        private bool _hasNewNotifications = false;

        public TrayApplicationManager(ILogger<TrayApplicationManager> logger, NotificationManager notificationManager)
        {
            _logger = logger;
            _notificationManager = notificationManager;
        }

        public void Start(CancellationToken cancellationToken)
        {
            if (_isRunning) return;

            _isRunning = true;
            
            // Start in STA thread for Windows Forms
            var thread = new Thread(() =>
            {
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);
                
                InitializeTrayIcon();
                InitializeMainForm();
                
                _logger.LogInformation("System tray initialized");
                
                // Start message loop
                Application.Run();
            });
            
            thread.SetApartmentState(ApartmentState.STA);
            thread.Start();
        }

        private void InitializeTrayIcon()
        {
            _trayIcon = new NotifyIcon()
            {
                Icon = IconManager.GetTrayIcon(false),
                Text = "Notification Center",
                Visible = true
            };

            _contextMenu = new ContextMenuStrip();
            _contextMenu.Items.Add("Open Notification Center", null, OnOpenMainWindow);
            _contextMenu.Items.Add("-");
            _contextMenu.Items.Add("Settings", null, OnOpenSettings);
            _contextMenu.Items.Add("About", null, OnAbout);
            _contextMenu.Items.Add("-");
            _contextMenu.Items.Add("Exit", null, OnExit);

            _trayIcon.ContextMenuStrip = _contextMenu;
            _trayIcon.DoubleClick += OnTrayIconDoubleClick;

            // Subscribe to notification events
            _notificationManager.NotificationReceived += OnNotificationReceived;
        }

        private void OnNotificationReceived(object sender, NotificationEventArgs e)
        {
            // Update tray icon with notification indicator
            _hasNewNotifications = true;
            UpdateTrayIcon();
            
            // Show balloon tip
            _trayIcon.ShowBalloonTip(5000, e.Notification.Title, e.Notification.Message, ToolTipIcon.Info);
        }

        private void UpdateTrayIcon()
        {
            if (_trayIcon != null)
            {
                _trayIcon.Icon?.Dispose();
                _trayIcon.Icon = IconManager.GetTrayIcon(_hasNewNotifications);
                _trayIcon.Text = _hasNewNotifications ? 
                    "Notification Center - New notifications available" : 
                    "Notification Center";
            }
        }

        private void OnTrayIconDoubleClick(object sender, EventArgs e)
        {
            ShowMainWindow();
        }

        private void OnOpenMainWindow(object sender, EventArgs e)
        {
            ShowMainWindow();
        }

        private void ShowMainWindow()
        {
            if (_mainForm == null || _mainForm.IsDisposed)
            {
                _mainForm = new MainForm(_notificationManager);
            }

            _mainForm.Show();
            _mainForm.WindowState = FormWindowState.Normal;
            _mainForm.BringToFront();
            _mainForm.Activate();
            
            // Clear notification indicator when main window is shown
            _hasNewNotifications = false;
            UpdateTrayIcon();
        }

        private void OnOpenSettings(object sender, EventArgs e)
        {
            var settingsForm = new SettingsForm();
            settingsForm.ShowDialog();
        }

        private void OnAbout(object sender, EventArgs e)
        {
            MessageBox.Show(
                "Notification Center v1.0\n\nCorporate notification system for employees.\n\n© 2025 Your Company",
                "About",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information
            );
        }

        private void OnExit(object sender, EventArgs e)
        {
            _isRunning = false;
            _trayIcon.Visible = false;
            Application.Exit();
        }

        public void Stop()
        {
            if (!_isRunning) return;

            _isRunning = false;
            
            _trayIcon?.Dispose();
            _contextMenu?.Dispose();
            _mainForm?.Close();
            
            Application.ExitThread();
            
            _logger.LogInformation("System tray stopped");
        }
    }
}
