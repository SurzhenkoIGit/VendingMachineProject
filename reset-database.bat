@echo off
echo === Сброс базы данных SodaVending ===
echo.
echo ВНИМАНИЕ: Это удалит все данные из базы данных!
echo.
set /p confirm="Вы уверены? (y/n): "
if /i "%confirm%" neq "y" goto end

echo.
echo Удаление базы данных...
cd SodaVending.Api
rmdir /s /q Migrations 2>nul
del /q *.db 2>nul

echo.
echo База данных будет создана заново при следующем запуске приложения.
echo.

:end
pause
