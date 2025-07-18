@echo off
echo === Установка SodaVending ===
echo.

echo [1/4] Восстановление пакетов Backend...
cd SodaVending.Api
dotnet restore
if errorlevel 1 goto error

echo.
echo [2/4] Сборка Backend...
dotnet build
if errorlevel 1 goto error

echo.
echo [3/4] Установка зависимостей Frontend...
cd ..\SodaVending.Client
call npm install
if errorlevel 1 goto error

echo.
echo [4/4] Установка завершена успешно!
echo.
echo Для запуска Backend: cd SodaVending.Api && dotnet run
echo Для запуска Frontend: cd SodaVending.Client && npm run dev
echo.
cd ..
pause
exit /b 0

:error
echo.
echo ОШИБКА: Установка прервана из-за ошибки!
pause
exit /b 1
