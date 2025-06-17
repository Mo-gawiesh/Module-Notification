using System;
using System.IO;
using System.Drawing;

namespace NotificationCenter.Service
{
    public static class IconManager
    {
        public static Icon GetMainIcon()
        {
            try
            {
                return EmbeddedIcons.GetMainIcon();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading main icon: {ex.Message}");
                return SystemIcons.Application;
            }
        }

        public static Icon GetTrayIcon(bool hasNotifications = false)
        {
            try
            {
                return EmbeddedIcons.GetTrayIcon(hasNotifications);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading tray icon: {ex.Message}");
                return SystemIcons.Information;
            }
        }

        public static Icon GetNotificationTypeIcon(NotificationType type)
        {
            try
            {
                return EmbeddedIcons.GetNotificationTypeIcon(type);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading notification icon: {ex.Message}");
                return SystemIcons.Information;
            }
        }

        public static Image GetDepartmentIcon(string department)
        {
            try
            {
                return EmbeddedIcons.CreateDepartmentIcon(department);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating department icon: {ex.Message}");
                return null;
            }
        }

        public static Image GetPriorityIcon(NotificationPriority priority)
        {
            try
            {
                return EmbeddedIcons.CreatePriorityIcon(priority);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating priority icon: {ex.Message}");
                return null;
            }
        }

        // Create a simple icon file for the application
        public static void CreateApplicationIconFile(string outputPath)
        {
            try
            {
                using (var bitmap = new Bitmap(32, 32))
                using (var graphics = Graphics.FromImage(bitmap))
                {
                    graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
                    graphics.Clear(Color.Transparent);

                    // Blue circle background
                    using (var brush = new SolidBrush(Color.FromArgb(0, 120, 212)))
                    {
                        graphics.FillEllipse(brush, 2, 2, 28, 28);
                    }

                    // White border
                    using (var pen = new Pen(Color.White, 2))
                    {
                        graphics.DrawEllipse(pen, 2, 2, 28, 28);
                    }

                    // Bell icon
                    EmbeddedIcons.DrawBellIcon(graphics, 16, 16, 16, Color.White);

                    // Red notification dot
                    using (var brush = new SolidBrush(Color.FromArgb(255, 69, 58)))
                    {
                        graphics.FillEllipse(brush, 22, 6, 8, 8);
                    }

                    // Save as ICO file
                    var icon = Icon.FromHandle(bitmap.GetHicon());
                    using (var fs = new FileStream(outputPath, FileMode.Create))
                    {
                        icon.Save(fs);
                    }
                    icon.Dispose();
                }

                Console.WriteLine($"Application icon created: {outputPath}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating application icon: {ex.Message}");
            }
        }
    }
}
