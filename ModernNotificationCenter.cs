using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;
using System.Collections.Generic;
using System.Linq;

namespace NotificationCenter
{
    public partial class ModernMainForm : Form
    {
        private Panel headerPanel;
        private Panel contentPanel;
        private Panel statsPanel;
        private Panel actionsPanel;
        private Panel notificationsPanel;
        private List<NotificationItem> notifications;
        private Label titleLabel;
        private Label subtitleLabel;
        private Button soundButton;
        private Button settingsButton;
        private Button expandButton;

        public ModernMainForm(List<NotificationItem> notifications)
        {
            this.notifications = notifications;
            InitializeModernForm();
            CreateModernInterface();
            LoadNotificationData();
        }

        private void InitializeModernForm()
        {
            // Form properties
            Text = "Центр уведомлений";
            Size = new Size(400, 700);
            StartPosition = FormStartPosition.CenterScreen;
            FormBorderStyle = FormBorderStyle.None;
            BackColor = Color.White;
            
            // Add drop shadow effect
            SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.DoubleBuffer, true);
            
            // Make form draggable
            MouseDown += Form_MouseDown;
            MouseMove += Form_MouseMove;
            MouseUp += Form_MouseUp;
        }

        private void CreateModernInterface()
        {
            // Header Panel (Teal)
            headerPanel = new Panel
            {
                Dock = DockStyle.Top,
                Height = 120,
                BackColor = Color.FromArgb(26, 188, 156) // Teal color
            };
            headerPanel.Paint += HeaderPanel_Paint;

            // Title
            titleLabel = new Label
            {
                Text = "Центр уведомлений",
                Font = new Font("Segoe UI", 18, FontStyle.Bold),
                ForeColor = Color.White,
                Location = new Point(60, 25),
                AutoSize = true,
                BackColor = Color.Transparent
            };

            // Subtitle
            subtitleLabel = new Label
            {
                Text = "15 новых • 2 требуют действий",
                Font = new Font("Segoe UI", 10),
                ForeColor = Color.FromArgb(200, 255, 255, 255),
                Location = new Point(60, 55),
                AutoSize = true,
                BackColor = Color.Transparent
            };

            // Header buttons
            soundButton = CreateHeaderButton("🔊", new Point(320, 25));
            settingsButton = CreateHeaderButton("⚙️", new Point(350, 25));
            expandButton = CreateHeaderButton("↗️", new Point(350, 55));

            // Profile circle
            var profilePanel = new Panel
            {
                Size = new Size(40, 40),
                Location = new Point(15, 30),
                BackColor = Color.White
            };
            profilePanel.Paint += (s, e) => {
                e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;
                e.Graphics.FillEllipse(Brushes.White, 0, 0, 40, 40);
                e.Graphics.DrawString("ГМ", new Font("Segoe UI", 12, FontStyle.Bold), 
                    new SolidBrush(Color.FromArgb(26, 188, 156)), 8, 10);
            };

            headerPanel.Controls.AddRange(new Control[] { 
                titleLabel, subtitleLabel, soundButton, settingsButton, expandButton, profilePanel 
            });

            // Tab Panel
            var tabPanel = CreateTabPanel();

            // Content Panel
            contentPanel = new Panel
            {
                Dock = DockStyle.Fill,
                BackColor = Color.FromArgb(248, 249, 250),
                Padding = new Padding(15)
            };

            // Stats Panel
            statsPanel = CreateStatsPanel();

            // Quick Actions Panel
            actionsPanel = CreateActionsPanel();

            // Notifications Panel
            notificationsPanel = CreateNotificationsPanel();

            // Add to content panel
            contentPanel.Controls.Add(notificationsPanel);
            contentPanel.Controls.Add(actionsPanel);
            contentPanel.Controls.Add(statsPanel);

            // Add to form
            Controls.Add(contentPanel);
            Controls.Add(tabPanel);
            Controls.Add(headerPanel);
        }

        private Button CreateHeaderButton(string text, Point location)
        {
            return new Button
            {
                Text = text,
                Size = new Size(25, 25),
                Location = location,
                FlatStyle = FlatStyle.Flat,
                FlatAppearance = { BorderSize = 0 },
                BackColor = Color.Transparent,
                ForeColor = Color.White,
                Font = new Font("Segoe UI Emoji", 10)
            };
        }

        private Panel CreateTabPanel()
        {
            var tabPanel = new Panel
            {
                Dock = DockStyle.Top,
                Height = 50,
                BackColor = Color.White
            };

            var homeTab = new Button
            {
                Text = "🏠 Главная",
                Size = new Size(180, 40),
                Location = new Point(10, 5),
                FlatStyle = FlatStyle.Flat,
                FlatAppearance = { BorderSize = 0 },
                BackColor = Color.Transparent,
                ForeColor = Color.FromArgb(26, 188, 156),
                Font = new Font("Segoe UI", 10, FontStyle.Bold),
                TextAlign = ContentAlignment.MiddleCenter
            };
            homeTab.Paint += (s, e) => {
                e.Graphics.FillRectangle(new SolidBrush(Color.FromArgb(26, 188, 156)), 
                    0, 37, homeTab.Width, 3);
            };

            var notifTab = new Button
            {
                Text = "🔔 Уведомления",
                Size = new Size(180, 40),
                Location = new Point(200, 5),
                FlatStyle = FlatStyle.Flat,
                FlatAppearance = { BorderSize = 0 },
                BackColor = Color.Transparent,
                ForeColor = Color.Gray,
                Font = new Font("Segoe UI", 10),
                TextAlign = ContentAlignment.MiddleCenter
            };

            tabPanel.Controls.AddRange(new Control[] { homeTab, notifTab });
            return tabPanel;
        }

        private Panel CreateStatsPanel()
        {
            var panel = new Panel
            {
                Dock = DockStyle.Top,
                Height = 100,
                BackColor = Color.Transparent,
                Margin = new Padding(0, 10, 0, 10)
            };

            // Total notifications card
            var totalCard = CreateStatsCard("🔔", "16", "Всего", Color.FromArgb(74, 144, 226), new Point(0, 0));
            
            // New notifications card  
            var newCard = CreateStatsCard("⚠️", "15", "Новых", Color.FromArgb(231, 76, 60), new Point(190, 0));

            panel.Controls.AddRange(new Control[] { totalCard, newCard });
            return panel;
        }

        private Panel CreateStatsCard(string icon, string number, string label, Color color, Point location)
        {
            var card = new Panel
            {
                Size = new Size(170, 80),
                Location = location,
                BackColor = Color.White
            };
            card.Paint += (s, e) => {
                e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;
                var rect = new Rectangle(0, 0, card.Width, card.Height);
                var path = GetRoundedRectPath(rect, 10);
                e.Graphics.FillPath(Brushes.White, path);
                
                // Add subtle shadow
                var shadowRect = new Rectangle(2, 2, card.Width, card.Height);
                var shadowPath = GetRoundedRectPath(shadowRect, 10);
                e.Graphics.FillPath(new SolidBrush(Color.FromArgb(20, 0, 0, 0)), shadowPath);
                e.Graphics.FillPath(Brushes.White, path);
            };

            var iconLabel = new Label
            {
                Text = icon,
                Font = new Font("Segoe UI Emoji", 20),
                ForeColor = color,
                Location = new Point(20, 15),
                AutoSize = true,
                BackColor = Color.Transparent
            };

            var numberLabel = new Label
            {
                Text = number,
                Font = new Font("Segoe UI", 24, FontStyle.Bold),
                ForeColor = color,
                Location = new Point(70, 10),
                AutoSize = true,
                BackColor = Color.Transparent
            };

            var textLabel = new Label
            {
                Text = label,
                Font = new Font("Segoe UI", 12),
                ForeColor = color,
                Location = new Point(70, 45),
                AutoSize = true,
                BackColor = Color.Transparent
            };

            card.Controls.AddRange(new Control[] { iconLabel, numberLabel, textLabel });
            return card;
        }

        private Panel CreateActionsPanel()
        {
            var panel = new Panel
            {
                Dock = DockStyle.Top,
                Height = 120,
                BackColor = Color.Transparent,
                Margin = new Padding(0, 10, 0, 10)
            };

            var titleLabel = new Label
            {
                Text = "Быстрые действия",
                Font = new Font("Segoe UI", 14, FontStyle.Bold),
                ForeColor = Color.FromArgb(44, 62, 80),
                Location = new Point(0, 0),
                AutoSize = true,
                BackColor = Color.Transparent
            };

            // Action buttons
            var docsBtn = CreateActionButton("📄", "Документы", "3", new Point(0, 30));
            var chatBtn = CreateActionButton("💬", "Чат", "2", new Point(190, 30));
            var calBtn = CreateActionButton("📅", "Календарь", "2", new Point(0, 75));
            var settBtn = CreateActionButton("⚙️", "Настройки", "", new Point(190, 75));

            panel.Controls.AddRange(new Control[] { titleLabel, docsBtn, chatBtn, calBtn, settBtn });
            return panel;
        }

        private Button CreateActionButton(string icon, string text, string count, Point location)
        {
            var button = new Button
            {
                Size = new Size(170, 40),
                Location = location,
                FlatStyle = FlatStyle.Flat,
                FlatAppearance = { BorderSize = 1, BorderColor = Color.FromArgb(220, 220, 220) },
                BackColor = Color.White,
                Font = new Font("Segoe UI", 10),
                TextAlign = ContentAlignment.MiddleLeft,
                Padding = new Padding(10, 0, 0, 0)
            };

            button.Paint += (s, e) => {
                e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;
                
                // Icon
                e.Graphics.DrawString(icon, new Font("Segoe UI Emoji", 12), 
                    Brushes.Gray, 10, 10);
                
                // Text
                e.Graphics.DrawString(text, new Font("Segoe UI", 10), 
                    Brushes.Black, 35, 12);
                
                // Count badge
                if (!string.IsNullOrEmpty(count))
                {
                    var countSize = e.Graphics.MeasureString(count, new Font("Segoe UI", 8));
                    var badgeRect = new Rectangle(140, 8, 20, 16);
                    e.Graphics.FillEllipse(new SolidBrush(Color.FromArgb(52, 152, 219)), badgeRect);
                    e.Graphics.DrawString(count, new Font("Segoe UI", 8), 
                        Brushes.White, 145, 10);
                }
            };

            return button;
        }

        private Panel CreateNotificationsPanel()
        {
            var panel = new Panel
            {
                Dock = DockStyle.Top,
                Height = 300,
                BackColor = Color.Transparent,
                Margin = new Padding(0, 10, 0, 0)
            };

            var titleLabel = new Label
            {
                Text = "Последние уведомления",
                Font = new Font("Segoe UI", 14, FontStyle.Bold),
                ForeColor = Color.FromArgb(44, 62, 80),
                Location = new Point(0, 0),
                AutoSize = true,
                BackColor = Color.Transparent
            };

            var scrollPanel = new Panel
            {
                Location = new Point(0, 30),
                Size = new Size(370, 200),
                BackColor = Color.Transparent,
                AutoScroll = true
            };

            // Add notification cards
            int yPos = 0;
            foreach (var notification in notifications.Take(3))
            {
                var card = CreateNotificationCard(notification, yPos);
                scrollPanel.Controls.Add(card);
                yPos += 70;
            }

            // Update time
            var updateLabel = new Label
            {
                Text = "Последнее обновление: 01:20",
                Font = new Font("Segoe UI", 9),
                ForeColor = Color.Gray,
                Location = new Point(0, 240),
                AutoSize = true,
                BackColor = Color.Transparent
            };

            var refreshBtn = new Button
            {
                Text = "🔄 Обновить",
                Size = new Size(80, 25),
                Location = new Point(290, 235),
                FlatStyle = FlatStyle.Flat,
                FlatAppearance = { BorderSize = 1, BorderColor = Color.FromArgb(26, 188, 156) },
                BackColor = Color.White,
                ForeColor = Color.FromArgb(26, 188, 156),
                Font = new Font("Segoe UI", 8)
            };

            panel.Controls.AddRange(new Control[] { titleLabel, scrollPanel, updateLabel, refreshBtn });
            return panel;
        }

        private Panel CreateNotificationCard(NotificationItem notification, int yPosition)
        {
            var card = new Panel
            {
                Size = new Size(350, 60),
                Location = new Point(0, yPosition),
                BackColor = Color.White,
                Margin = new Padding(0, 5, 0, 5)
            };

            card.Paint += (s, e) => {
                e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;
                var rect = new Rectangle(0, 0, card.Width, card.Height);
                var path = GetRoundedRectPath(rect, 8);
                e.Graphics.FillPath(Brushes.White, path);
                e.Graphics.DrawPath(new Pen(Color.FromArgb(230, 230, 230)), path);
                
                // Left colored bar
                var barColor = notification.Type == NotificationType.Warning ? 
                    Color.FromArgb(255, 149, 0) : Color.FromArgb(52, 152, 219);
                e.Graphics.FillRectangle(new SolidBrush(barColor), 0, 0, 4, card.Height);
            };

            var iconLabel = new Label
            {
                Text = notification.Type == NotificationType.Warning ? "⚠️" : "ℹ️",
                Font = new Font("Segoe UI Emoji", 14),
                Location = new Point(15, 8),
                AutoSize = true,
                BackColor = Color.Transparent
            };

            var titleLabel = new Label
            {
                Text = $"🚩 {notification.Title}",
                Font = new Font("Segoe UI", 10, FontStyle.Bold),
                ForeColor = Color.FromArgb(44, 62, 80),
                Location = new Point(45, 8),
                Size = new Size(200, 15),
                BackColor = Color.Transparent
            };

            var messageLabel = new Label
            {
                Text = notification.Message.Length > 50 ? 
                    notification.Message.Substring(0, 50) + "..." : notification.Message,
                Font = new Font("Segoe UI", 9),
                ForeColor = Color.Gray,
                Location = new Point(45, 25),
                Size = new Size(250, 30),
                BackColor = Color.Transparent
            };

            var timeLabel = new Label
            {
                Text = notification.Time,
                Font = new Font("Segoe UI", 8),
                ForeColor = Color.FromArgb(26, 188, 156),
                Location = new Point(300, 8),
                AutoSize = true,
                BackColor = Color.Transparent
            };

            // New indicator
            if (notification.IsNew)
            {
                var newDot = new Panel
                {
                    Size = new Size(8, 8),
                    Location = new Point(320, 25),
                    BackColor = Color.FromArgb(26, 188, 156)
                };
                newDot.Paint += (s, e) => {
                    e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;
                    e.Graphics.FillEllipse(new SolidBrush(Color.FromArgb(26, 188, 156)), 0, 0, 8, 8);
                };
                card.Controls.Add(newDot);
            }

            card.Controls.AddRange(new Control[] { iconLabel, titleLabel, messageLabel, timeLabel });
            return card;
        }

        private GraphicsPath GetRoundedRectPath(Rectangle rect, int radius)
        {
            var path = new GraphicsPath();
            path.AddArc(rect.X, rect.Y, radius, radius, 180, 90);
            path.AddArc(rect.X + rect.Width - radius, rect.Y, radius, radius, 270, 90);
            path.AddArc(rect.X + rect.Width - radius, rect.Y + rect.Height - radius, radius, radius, 0, 90);
            path.AddArc(rect.X, rect.Y + rect.Height - radius, radius, radius, 90, 90);
            path.CloseAllFigures();
            return path;
        }

        private void HeaderPanel_Paint(object sender, PaintEventArgs e)
        {
            // Gradient background
            var rect = new Rectangle(0, 0, headerPanel.Width, headerPanel.Height);
            using (var brush = new LinearGradientBrush(rect, 
                Color.FromArgb(26, 188, 156), Color.FromArgb(22, 160, 133), 90f))
            {
                e.Graphics.FillRectangle(brush, rect);
            }
        }

        private void LoadNotificationData()
        {
            // Update subtitle with actual counts
            int newCount = notifications.Count(n => n.IsNew);
            int actionCount = notifications.Count(n => n.Type == NotificationType.Warning);
            subtitleLabel.Text = $"{newCount} новых • {actionCount} требуют действий";
        }

        // Form dragging functionality
        private bool dragging = false;
        private Point dragCursorPoint;
        private Point dragFormPoint;

        private void Form_MouseDown(object sender, MouseEventArgs e)
        {
            dragging = true;
            dragCursorPoint = Cursor.Position;
            dragFormPoint = Location;
        }

        private void Form_MouseMove(object sender, MouseEventArgs e)
        {
            if (dragging)
            {
                Point dif = Point.Subtract(Cursor.Position, new Size(dragCursorPoint));
                Location = Point.Add(dragFormPoint, new Size(dif));
            }
        }

        private void Form_MouseUp(object sender, MouseEventArgs e)
        {
            dragging = false;
        }
    }
}
