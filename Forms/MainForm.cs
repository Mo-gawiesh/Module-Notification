using System;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;

namespace NotificationCenter.Service
{
    public partial class MainForm : Form
    {
        private readonly NotificationManager _notificationManager;
        private ListView _notificationsList;
        private Panel _detailsPanel;
        private Label _titleLabel;
        private Label _messageLabel;
        private Panel _actionsPanel;

        public MainForm(NotificationManager notificationManager)
        {
            _notificationManager = notificationManager;
            InitializeComponent();
            LoadNotifications();
            
            // Подписка на события
            _notificationManager.NotificationReceived += OnNotificationReceived;
            _notificationManager.NotificationUpdated += OnNotificationUpdated;
        }

        private void InitializeComponent()
        {
            Text = "Центр уведомлений";
            Size = new Size(800, 600);
            StartPosition = FormStartPosition.CenterScreen;
            Icon = CreateApplicationIcon();

            // Основной layout
            var splitContainer = new SplitContainer()
            {
                Dock = DockStyle.Fill,
                SplitterDistance = 400,
                Orientation = Orientation.Vertical
            };

            // Список уведомлений
            _notificationsList = new ListView()
            {
                Dock = DockStyle.Fill,
                View = View.Details,
                FullRowSelect = true,
                GridLines = true,
                MultiSelect = false
            };

            _notificationsList.Columns.Add("Время", 80);
            _notificationsList.Columns.Add("Тип", 60);
            _notificationsList.Columns.Add("Отдел", 100);
            _notificationsList.Columns.Add("Заголовок", 200);
            _notificationsList.Columns.Add("Статус", 80);
            _notificationsList.Columns.Add("Приоритет", 80);

            _notificationsList.SelectedIndexChanged += OnNotificationSelected;

            // Панель деталей
            _detailsPanel = new Panel()
            {
                Dock = DockStyle.Fill,
                Padding = new Padding(10)
            };

            _titleLabel = new Label()
            {
                Font = new Font("Segoe UI", 12, FontStyle.Bold),
                AutoSize = false,
                Height = 30,
                Dock = DockStyle.Top
            };

            _messageLabel = new Label()
            {
                Font = new Font("Segoe UI", 10),
                AutoSize = false,
                Height = 100,
                Dock = DockStyle.Top
            };

            _actionsPanel = new Panel()
            {
                Height = 50,
                Dock = DockStyle.Bottom
            };

            _detailsPanel.Controls.Add(_messageLabel);
            _detailsPanel.Controls.Add(_titleLabel);
            _detailsPanel.Controls.Add(_actionsPanel);

            splitContainer.Panel1.Controls.Add(_notificationsList);
            splitContainer.Panel2.Controls.Add(_detailsPanel);

            Controls.Add(splitContainer);

            // Меню
            var menuStrip = new MenuStrip();
            var fileMenu = new ToolStripMenuItem("Файл");
            fileMenu.DropDownItems.Add("Обновить", null, OnRefresh);
            fileMenu.DropDownItems.Add("-");
            fileMenu.DropDownItems.Add("Выход", null, (s, e) => Close());

            var viewMenu = new ToolStripMenuItem("Вид");
            viewMenu.DropDownItems.Add("Только новые", null, OnShowOnlyNew);
            viewMenu.DropDownItems.Add("Все уведомления", null, OnShowAll);

            menuStrip.Items.Add(fileMenu);
            menuStrip.Items.Add(viewMenu);
            MainMenuStrip = menuStrip;
            Controls.Add(menuStrip);

            // Статусная строка
            var statusStrip = new StatusStrip();
            var statusLabel = new ToolStripStatusLabel("Готов");
            statusStrip.Items.Add(statusLabel);
            Controls.Add(statusStrip);
        }

        private Icon CreateApplicationIcon()
        {
            var bitmap = new Bitmap(32, 32);
            using (var graphics = Graphics.FromImage(bitmap))
            {
                graphics.Clear(Color.Transparent);
                graphics.FillEllipse(Brushes.DodgerBlue, 4, 4, 24, 24);
                graphics.DrawString("!", new Font("Arial", 16, FontStyle.Bold), Brushes.White, 10, 6);
            }
            return Icon.FromHandle(bitmap.GetHicon());
        }

        private void LoadNotifications()
        {
            _notificationsList.Items.Clear();
            
            var notifications = _notificationManager.GetAllNotifications();
            
            foreach (var notification in notifications.OrderByDescending(n => n.CreatedAt))
            {
                var item = new ListViewItem(notification.CreatedAt.ToString("HH:mm"));
                item.SubItems.Add(GetTypeIcon(notification.Type));
                item.SubItems.Add(notification.Department ?? "");
                item.SubItems.Add(notification.Title);
                item.SubItems.Add(notification.Status);
                item.SubItems.Add(notification.Priority.ToString());
                item.Tag = notification;
                
                if (!notification.IsRead)
                {
                    item.Font = new Font(item.Font, FontStyle.Bold);
                    item.BackColor = Color.LightBlue;
                }

                _notificationsList.Items.Add(item);
            }
        }

        private string GetTypeIcon(NotificationType type)
        {
            return type switch
            {
                NotificationType.Error => "❌",
                NotificationType.Warning => "⚠️",
                NotificationType.Success => "✅",
                _ => "ℹ️"
            };
        }

        private void OnNotificationSelected(object sender, EventArgs e)
        {
            if (_notificationsList.SelectedItems.Count == 0) return;

            var notification = (NotificationItem)_notificationsList.SelectedItems[0].Tag;
            ShowNotificationDetails(notification);

            // Отметить как прочитанное
            if (!notification.IsRead)
            {
                _notificationManager.MarkAsReadAsync(notification.Id);
            }
        }

        private void ShowNotificationDetails(NotificationItem notification)
        {
            _titleLabel.Text = notification.Title;
            _messageLabel.Text = notification.Message;

            // Очистка панели действий
            _actionsPanel.Controls.Clear();

            if (notification.ActionRequired && notification.Status == "New")
            {
                var approveBtn = new Button()
                {
                    Text = "Одобрить",
                    Size = new Size(80, 30),
                    Location = new Point(10, 10),
                    BackColor = Color.Green,
                    ForeColor = Color.White
                };
                approveBtn.Click += (s, e) => ProcessAction(notification.Id, "Approved");

                var rejectBtn = new Button()
                {
                    Text = "Отклонить",
                    Size = new Size(80, 30),
                    Location = new Point(100, 10),
                    BackColor = Color.Red,
                    ForeColor = Color.White
                };
                rejectBtn.Click += (s, e) => ProcessAction(notification.Id, "Rejected");

                var responseBtn = new Button()
                {
                    Text = "Ответить",
                    Size = new Size(80, 30),
                    Location = new Point(190, 10),
                    BackColor = Color.Blue,
                    ForeColor = Color.White
                };
                responseBtn.Click += (s, e) => ShowResponseDialog(notification);

                _actionsPanel.Controls.Add(approveBtn);
                _actionsPanel.Controls.Add(rejectBtn);
                _actionsPanel.Controls.Add(responseBtn);
            }
        }

        private void ProcessAction(string notificationId, string action)
        {
            _notificationManager.ProcessActionAsync(notificationId, action);
            LoadNotifications(); // Обновить список
        }

        private void ShowResponseDialog(NotificationItem notification)
        {
            var responseForm = new ResponseForm(notification);
            if (responseForm.ShowDialog() == DialogResult.OK)
            {
                _notificationManager.ProcessActionAsync(notification.Id, "Responded", responseForm.Response);
                LoadNotifications();
            }
        }

        private void OnNotificationReceived(object sender, NotificationEventArgs e)
        {
            // Обновление UI в главном потоке
            if (InvokeRequired)
            {
                Invoke(new Action(() => LoadNotifications()));
            }
            else
            {
                LoadNotifications();
            }
        }

        private void OnNotificationUpdated(object sender, NotificationEventArgs e)
        {
            OnNotificationReceived(sender, e);
        }

        private void OnRefresh(object sender, EventArgs e)
        {
            LoadNotifications();
        }

        private void OnShowOnlyNew(object sender, EventArgs e)
        {
            // Фильтрация только новых уведомлений
            LoadNotifications();
        }

        private void OnShowAll(object sender, EventArgs e)
        {
            LoadNotifications();
        }

        protected override void SetVisibleCore(bool value)
        {
            // Скрытие из панели задач при закрытии
            base.SetVisibleCore(value);
        }

        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            // Скрытие вместо закрытия
            e.Cancel = true;
            Hide();
        }
    }
}
