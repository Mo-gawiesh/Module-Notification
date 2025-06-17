# Modern Notification Center (C# Desktop Application)

This project provides a notification system for Windows. It can be run in two modes:

## 1. Standalone Desktop Tray Application

This mode runs an application directly in your system tray, displaying notifications and allowing you to view them in a dedicated window.

**How to run:**
- Build the project (e.g., in Visual Studio or using `dotnet build`).
- Run the main executable directly. This is typically found in a path like `bin/Debug/net6.0-windows/YourAppName.exe` (e.g., `NotificationCenter.exe` or `ModernNotificationCenter.exe` - **please verify the actual .exe name from your build output directory**).
- The application icon will appear in the system tray.

## 2. Background Windows Service

This mode runs a background service that can generate notifications. This is useful for automated tasks or system-level alerts. The service component is named `NotificationCenterService` and its executable is `NotificationCenter.Service.exe`.

**How to install/uninstall the service:**
- **To install:** Run `install-service.bat` as Administrator. This will install and start the `NotificationCenterService`.
- **To uninstall:** Run `uninstall-service.bat` as Administrator. This will stop and remove the `NotificationCenterService`.

**Important:** The `.bat` files are *only* for managing the Windows Service mode using `NotificationCenter.Service.exe`. For the interactive tray application, run the main executable (e.g., `NotificationCenter.exe`) directly as described above.

---
This README replaces previous content that was unrelated to this C# desktop application.
