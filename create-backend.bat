@echo off
cd /d C:\Users\Manernyj_i\Desktop\SodaWending
dotnet new sln -n SodaVending
cd SodaVending.Api
dotnet new webapi -n SodaVending.Api --no-https
cd ..
dotnet sln add SodaVending.Api\SodaVending.Api.csproj
