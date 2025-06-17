using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

namespace NotificationCenter.Service
{
    public static class IconGenerator
    {
        public static void GenerateAllIcons(string outputDirectory)
        {
            if (!Directory.Exists(outputDirectory))
                Directory.CreateDirectory(outputDirectory);

            // Main application icon
            CreateMainApplicationIcon(Path.Combine(outputDirectory, "icon.ico"));
            
            // Tray icons
            CreateTrayIcon(Path.Combine(outputDirectory, "tray-normal.ico"), false);
            CreateTrayIcon(Path.Combine(outputDirectory, "tray-notification.ico"), true);
            
            // Notification type icons
            CreateNotificationTypeIcons(outputDirectory);
            
            // UI element icons (PNG format for better quality)
            CreateUIIcons(outputDirectory);
            
            Console.WriteLine($"All icons generated in: {outputDirectory}");
        }

        public static void CreateMainApplicationIcon(string outputPath)
        {
            using (var bitmap = new Bitmap(256, 256))
            using (var graphics = Graphics.FromImage(bitmap))
            {
                graphics.SmoothingMode = SmoothingMode.AntiAlias;
                graphics.Clear(Color.Transparent);
                
                // Main circle background (Windows blue)
                using (var brush = new LinearGradientBrush(
                    new Rectangle(0, 0, 256, 256),
                    Color.FromArgb(0, 120, 212),    // Windows blue
                    Color.FromArgb(0, 90, 158),     // Darker blue
                    LinearGradientMode.Vertical))
                {
                    graphics.FillEllipse(brush, 20, 20, 216, 216);
                }
                
                // White border
                using (var pen = new Pen(Color.White, 4))
                {
                    graphics.DrawEllipse(pen, 22, 22, 212, 212);
                }
                
                // Bell icon in the center
                DrawBellIcon(graphics, 128, 128, 80, Color.White);
                
                // Notification dot
                using (var brush = new SolidBrush(Color.FromArgb(255, 69, 58))) // Red
                {
                    graphics.FillEllipse(brush, 180, 60, 40, 40);
                }
                
                SaveAsIcon(bitmap, outputPath);
            }
        }

        public static void CreateTrayIcon(string outputPath, bool hasNotification)
        {
            using (var bitmap = new Bitmap(32, 32))
            using (var graphics = Graphics.FromImage(bitmap))
            {
                graphics.SmoothingMode = SmoothingMode.AntiAlias;
                graphics.Clear(Color.Transparent);
                
                // Main circle
                Color mainColor = hasNotification ? Color.FromArgb(255, 69, 58) : Color.FromArgb(0, 120, 212);
                using (var brush = new SolidBrush(mainColor))
                {
                    graphics.FillEllipse(brush, 2, 2, 28, 28);
                }
                
                // Bell icon
                DrawBellIcon(graphics, 16, 16, 12, Color.White);
                
                if (hasNotification)
                {
                    // Small notification dot
                    using (var brush = new SolidBrush(Color.Yellow))
                    {
                        graphics.FillEllipse(brush, 22, 4, 8, 8);
                    }
                }
                
                SaveAsIcon(bitmap, outputPath);
            }
        }

        private static void DrawBellIcon(Graphics graphics, int centerX, int centerY, int size, Color color)
        {
            using (var brush = new SolidBrush(color))
            using (var pen = new Pen(color, 2))
            {
                int halfSize = size / 2;
                
                // Bell body (arc)
                Rectangle bellRect = new Rectangle(centerX - halfSize + 4, centerY - halfSize + 2, size - 8, size - 6);
                graphics.FillPie(brush, bellRect, 0, 180);
                
                // Bell top
                Rectangle topRect = new Rectangle(centerX - 2, centerY - halfSize, 4, 6);
                graphics.FillRectangle(brush, topRect);
                
                // Bell bottom (clapper)
                Rectangle clapperRect = new Rectangle(centerX - 1, centerY + halfSize - 8, 2, 4);
                graphics.FillRectangle(brush, clapperRect);
            }
        }

        public static void CreateNotificationTypeIcons(string outputDirectory)
        {
            // Info icon (blue)
            CreateNotificationIcon(Path.Combine(outputDirectory, "info.ico"), 
                Color.FromArgb(0, 120, 212), "i");
            
            // Warning icon (orange)
            CreateNotificationIcon(Path.Combine(outputDirectory, "warning.ico"), 
                Color.FromArgb(255, 149, 0), "!");
            
            // Error icon (red)
            CreateNotificationIcon(Path.Combine(outputDirectory, "error.ico"), 
                Color.FromArgb(255, 69, 58), "×");
            
            // Success icon (green)
            CreateNotificationIcon(Path.Combine(outputDirectory, "success.ico"), 
                Color.FromArgb(52, 199, 89), "✓");
        }

        private static void CreateNotificationIcon(string outputPath, Color backgroundColor, string symbol)
        {
            using (var bitmap = new Bitmap(64, 64))
            using (var graphics = Graphics.FromImage(bitmap))
            {
                graphics.SmoothingMode = SmoothingMode.AntiAlias;
                graphics.TextRenderingHint = System.Drawing.Text.TextRenderingHint.AntiAliasGridFit;
                graphics.Clear(Color.Transparent);
                
                // Background circle
                using (var brush = new SolidBrush(backgroundColor))
                {
                    graphics.FillEllipse(brush, 4, 4, 56, 56);
                }
                
                // Symbol
                using (var font = new Font("Segoe UI", 28, FontStyle.Bold))
                using (var brush = new SolidBrush(Color.White))
                {
                    var textSize = graphics.MeasureString(symbol, font);
                    float x = (64 - textSize.Width) / 2;
                    float y = (64 - textSize.Height) / 2;
                    graphics.DrawString(symbol, font, brush, x, y);
                }
                
                SaveAsIcon(bitmap, outputPath);
            }
        }

        public static void CreateUIIcons(string outputDirectory)
        {
            // Department icons
            CreateDepartmentIcon(Path.Combine(outputDirectory, "dept-management.png"), "📋", Color.FromArgb(0, 120, 212));
            CreateDepartmentIcon(Path.Combine(outputDirectory, "dept-utilities.png"), "🏠", Color.FromArgb(52, 199, 89));
            CreateDepartmentIcon(Path.Combine(outputDirectory, "dept-accounting.png"), "💰", Color.FromArgb(255, 149, 0));
            CreateDepartmentIcon(Path.Combine(outputDirectory, "dept-technical.png"), "🔧", Color.FromArgb(255, 69, 58));
            CreateDepartmentIcon(Path.Combine(outputDirectory, "dept-system.png"), "📢", Color.FromArgb(88, 86, 214));
            
            // Priority icons
            CreatePriorityIcon(Path.Combine(outputDirectory, "priority-low.png"), Color.FromArgb(52, 199, 89));
            CreatePriorityIcon(Path.Combine(outputDirectory, "priority-medium.png"), Color.FromArgb(255, 149, 0));
            CreatePriorityIcon(Path.Combine(outputDirectory, "priority-high.png"), Color.FromArgb(255, 69, 58));
            CreatePriorityIcon(Path.Combine(outputDirectory, "priority-critical.png"), Color.FromArgb(175, 82, 222));
        }

        private static void CreateDepartmentIcon(string outputPath, string emoji, Color backgroundColor)
        {
            using (var bitmap = new Bitmap(48, 48))
            using (var graphics = Graphics.FromImage(bitmap))
            {
                graphics.SmoothingMode = SmoothingMode.AntiAlias;
                graphics.Clear(Color.Transparent);
                
                // Background circle
                using (var brush = new SolidBrush(Color.FromArgb(50, backgroundColor)))
                {
                    graphics.FillEllipse(brush, 2, 2, 44, 44);
                }
                
                // Border
                using (var pen = new Pen(backgroundColor, 2))
                {
                    graphics.DrawEllipse(pen, 2, 2, 44, 44);
                }
                
                // Emoji/Symbol
                using (var font = new Font("Segoe UI Emoji", 20))
                using (var brush = new SolidBrush(backgroundColor))
                {
                    var textSize = graphics.MeasureString(emoji, font);
                    float x = (48 - textSize.Width) / 2;
                    float y = (48 - textSize.Height) / 2;
                    graphics.DrawString(emoji, font, brush, x, y);
                }
                
                bitmap.Save(outputPath, ImageFormat.Png);
            }
        }

        private static void CreatePriorityIcon(string outputPath, Color color)
        {
            using (var bitmap = new Bitmap(24, 24))
            using (var graphics = Graphics.FromImage(bitmap))
            {
                graphics.SmoothingMode = SmoothingMode.AntiAlias;
                graphics.Clear(Color.Transparent);
                
                // Priority indicator (diamond shape)
                Point[] points = {
                    new Point(12, 2),   // Top
                    new Point(22, 12),  // Right
                    new Point(12, 22),  // Bottom
                    new Point(2, 12)    // Left
                };
                
                using (var brush = new SolidBrush(color))
                {
                    graphics.FillPolygon(brush, points);
                }
                
                bitmap.Save(outputPath, ImageFormat.Png);
            }
        }

        private static void SaveAsIcon(Bitmap bitmap, string outputPath)
        {
            try
            {
                // Create multiple sizes for the icon
                var sizes = new[] { 16, 24, 32, 48, 64, 128, 256 };
                var icons = new List<Bitmap>();
                
                foreach (var size in sizes)
                {
                    var resized = new Bitmap(size, size);
                    using (var graphics = Graphics.FromImage(resized))
                    {
                        graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                        graphics.SmoothingMode = SmoothingMode.AntiAlias;
                        graphics.DrawImage(bitmap, 0, 0, size, size);
                    }
                    icons.Add(resized);
                }
                
                // Save as ICO file
                using (var fs = new FileStream(outputPath, FileMode.Create))
                {
                    SaveAsMultiSizeIcon(icons, fs);
                }
                
                // Cleanup
                foreach (var icon in icons)
                {
                    icon.Dispose();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving icon {outputPath}: {ex.Message}");
                
                // Fallback: save as simple icon
                using (var fs = new FileStream(outputPath, FileMode.Create))
                {
                    var icon = Icon.FromHandle(bitmap.GetHicon());
                    icon.Save(fs);
                    icon.Dispose();
                }
            }
        }

        private static void SaveAsMultiSizeIcon(List<Bitmap> bitmaps, Stream stream)
        {
            var writer = new BinaryWriter(stream);
            
            // ICO header
            writer.Write((short)0);           // Reserved
            writer.Write((short)1);           // Type (1 = ICO)
            writer.Write((short)bitmaps.Count); // Number of images
            
            var offset = 6 + (16 * bitmaps.Count);
            
            // Directory entries
            foreach (var bitmap in bitmaps)
            {
                writer.Write((byte)bitmap.Width);   // Width
                writer.Write((byte)bitmap.Height);  // Height
                writer.Write((byte)0);              // Color count
                writer.Write((byte)0);              // Reserved
                writer.Write((short)1);             // Planes
                writer.Write((short)32);            // Bits per pixel
                
                var imageData = GetBitmapData(bitmap);
                writer.Write(imageData.Length);     // Size
                writer.Write(offset);               // Offset
                offset += imageData.Length;
            }
            
            // Image data
            foreach (var bitmap in bitmaps)
            {
                var imageData = GetBitmapData(bitmap);
                writer.Write(imageData);
            }
        }

        private static byte[] GetBitmapData(Bitmap bitmap)
        {
            using (var ms = new MemoryStream())
            {
                bitmap.Save(ms, ImageFormat.Png);
                return ms.ToArray();
            }
        }
    }
}
