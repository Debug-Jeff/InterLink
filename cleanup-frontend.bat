@echo off
echo 🧹 Cleaning up for frontend-only deployment...

REM Move frontend contents to root
echo Moving frontend files to root...
xcopy /E /I /Y frontend\* .\
if exist frontend rmdir /s /q frontend

REM Remove backend directory completely
if exist backend rmdir /s /q backend

REM Copy frontend package.json to root
copy frontend-package.json package.json

REM Remove root-level files that aren't needed for frontend
if exist test-deployment.js del test-deployment.js
if exist deployment-setup.md del deployment-setup.md
if exist cleanup-frontend.sh del cleanup-frontend.sh
if exist cleanup-backend.sh del cleanup-backend.sh
if exist cleanup-frontend.bat del cleanup-frontend.bat
if exist cleanup-backend.bat del cleanup-backend.bat
if exist frontend-package.json del frontend-package.json
if exist backend-package.json del backend-package.json

echo ✅ Frontend cleanup complete!
echo 📁 Frontend files are now at root level
echo.
echo 🚀 Ready to commit frontend-only branch!