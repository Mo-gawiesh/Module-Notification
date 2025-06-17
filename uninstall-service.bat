@echo off
echo Удаление службы "Центр уведомлений"...

REM Остановка службы
sc stop "NotificationCenterService"

REM Удаление службы
sc delete "NotificationCenterService"

echo Служба успешно удалена!
pause
