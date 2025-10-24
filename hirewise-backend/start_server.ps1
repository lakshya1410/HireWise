# PowerShell script to start HireWise backend
Write-Host "Starting HireWise Backend Server..."
Write-Host "Working directory: $PSScriptRoot"
Write-Host "MongoDB URL: mongodb://localhost:27017"
Write-Host "Database: hirewise"

# Change to script directory
Set-Location -Path $PSScriptRoot

# Export PYTHONPATH so the app package can be imported
$env:PYTHONPATH = $PSScriptRoot
Write-Host "PYTHONPATH=$env:PYTHONPATH"

# Start uvicorn
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
