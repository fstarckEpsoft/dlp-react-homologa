@echo off
echo Abrindo o Visual Studio Code...
start code .
timeout /t 1 >nul
echo Iniciando o servidor NPM...
npm start
teste