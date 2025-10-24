@echo off
echo Starting HireWise Backend Server...
echo Working directory: %~dp0
echo MongoDB URL: mongodb://localhost:27017
echo Database: hirewise
echo.

REM Change to script directory (project backend folder)
cd /d "%~dp0"

REM Ensure Python can import the app package
set "PYTHONPATH=%~dp0"
echo PYTHONPATH=%PYTHONPATH%

REM Launch uvicorn
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
