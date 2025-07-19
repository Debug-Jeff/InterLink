@echo off
echo 🧹 Cleaning up for backend-only deployment...

REM Move backend contents to root
echo Moving backend files to root...
xcopy /E /I /Y backend\* .\
if exist backend rmdir /s /q backend

REM Remove frontend directory completely
if exist frontend rmdir /s /q frontend

REM Copy backend package.json to root
copy backend-package.json package.json

REM Remove root-level files that aren't needed for backend
if exist test-deployment.js del test-deployment.js
if exist deployment-setup.md del deployment-setup.md
if exist cleanup-frontend.sh del cleanup-frontend.sh
if exist cleanup-backend.sh del cleanup-backend.sh
if exist cleanup-frontend.bat del cleanup-frontend.bat
if exist cleanup-backend.bat del cleanup-backend.bat
if exist frontend-package.json del frontend-package.json
if exist backend-package.json del backend-package.json

echo ✅ Backend cleanup complete!
echo 📁 Backend files are now at root level
echo.
echo 🚀 Ready to commit backend-only branch!