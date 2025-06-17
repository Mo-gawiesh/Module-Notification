using System;
using System.ServiceProcess;
using System.Threading;
using System.Threading.Tasks;
using System.Timers;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace NotificationCenter.Service
{
    public class NotificationService : ServiceBase
    {
        private readonly ILogger<NotificationService> _logger;
        private readonly NotificationManager _notificationManager;
        private readonly TrayApplicationManager _trayManager;
        private System.Timers.Timer _timer;
        private CancellationTokenSource _cancellationTokenSource;

        public NotificationService()
        {
            ServiceName = "NotificationCenterService";
            CanStop = true;
            CanPauseAndContinue = false;
            AutoLog = true;

            // Настройка DI контейнера
            var services = new ServiceCollection();
            ConfigureServices(services);
            var serviceProvider = services.BuildServiceProvider();

            _logger = serviceProvider.GetRequiredService<ILogger<NotificationService>>();
            _notificationManager = serviceProvider.GetRequiredService<NotificationManager>();
            _trayManager = serviceProvider.GetRequiredService<TrayApplicationManager>();
        }

        private void ConfigureServices(IServiceCollection services)
        {
            services.AddLogging(builder => builder.AddEventLog());
            services.AddSingleton<NotificationManager>();
            services.AddSingleton<TrayApplicationManager>();
            services.AddSingleton<ApiClient>();
            services.AddSingleton<DatabaseManager>();
        }

        protected override void OnStart(string[] args)
        {
            try
            {
                _logger.LogInformation("Служба центра уведомлений запускается...");
                
                _cancellationTokenSource = new CancellationTokenSource();
                
                // Запуск системного трея
                Task.Run(() => _trayManager.Start(_cancellationTokenSource.Token));
                
                // Настройка таймера для автоматических уведомлений
                _timer = new System.Timers.Timer(30000); // 30 секунд
                _timer.Elapsed += OnTimerElapsed;
                _timer.AutoReset = true;
                _timer.Enabled = true;

                // Инициализация менеджера уведомлений
                _notificationManager.Initialize();

                _logger.LogInformation("Служба центра уведомлений успешно запущена");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при запуске службы");
                throw;
            }
        }

        protected override void OnStop()
        {
            try
            {
                _logger.LogInformation("Остановка службы центра уведомлений...");
                
                _timer?.Stop();
                _timer?.Dispose();
                
                _cancellationTokenSource?.Cancel();
                _trayManager?.Stop();
                
                _logger.LogInformation("Служба центра уведомлений остановлена");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при остановке службы");
            }
        }

        private async void OnTimerElapsed(object sender, ElapsedEventArgs e)
        {
            try
            {
                await _notificationManager.CheckForNewNotificationsAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при проверке новых уведомлений");
            }
        }

        // Для отладки в консоли
        public void StartConsole()
        {
            OnStart(null);
            Console.WriteLine("Служба запущена. Нажмите любую клавишу для остановки...");
            Console.ReadKey();
            OnStop();
        }
    }
}
