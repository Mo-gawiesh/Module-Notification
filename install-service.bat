@echo off
echo Установка службы "Центр уведомлений"...

REM Остановка службы если она запущена
sc stop "NotificationCenterService" 2>nul

REM Удаление существующей службы
sc delete "NotificationCenterService" 2>nul

REM Установка новой службы
sc create "NotificationCenterService" binPath= "%~dp0NotificationCenter.Service.exe" start= auto DisplayName= "Центр уведомлений"

REM Настройка описания службы
sc description "NotificationCenterService" "Корпоративная система уведомлений для сотрудников"

REM Настройка восстановления службы при сбое
sc failure "NotificationCenterService" reset= 86400 actions= restart/5000/restart/10000/restart/20000

REM Запуск службы
sc start "NotificationCenterService"

echo Служба успешно установлена и запущена!
pause
