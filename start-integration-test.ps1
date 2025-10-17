# Quick Start Script - Frontend & Backend Integration Test
# This script tests the integration between React frontend and Spring Boot backend

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "   FRONTEND-BACKEND INTEGRATION TEST" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Check if backend is running
Write-Host "Checking if backend is running..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8080/equipment" -Method Get -TimeoutSec 3
    Write-Host "✅ Backend is RUNNING on http://localhost:8080" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is NOT running!" -ForegroundColor Red
    Write-Host "`nTo start backend:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor White
    Write-Host "  mvn spring-boot:run`n" -ForegroundColor White
    
    $response = Read-Host "Do you want to start the backend now? (y/n)"
    if ($response -eq 'y') {
        Write-Host "`nStarting backend in new window..." -ForegroundColor Green
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; mvn spring-boot:run"
        Write-Host "⏳ Waiting 15 seconds for backend to start..." -ForegroundColor Yellow
        Start-Sleep -Seconds 15
    } else {
        Write-Host "`n⚠️  Running in Demo Mode (Frontend will use mock data)" -ForegroundColor Yellow
    }
}

# Check if frontend dependencies are installed
Write-Host "`nChecking frontend dependencies..." -ForegroundColor Yellow
if (Test-Path "$PSScriptRoot\node_modules") {
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend dependencies not installed!" -ForegroundColor Red
    Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
    npm install
}

# Display test credentials
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "           TEST CREDENTIALS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Admin Account (Seeded in Backend):" -ForegroundColor Yellow
Write-Host "  Email:    admin@example.com" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host "  Role:     ADMIN" -ForegroundColor White

# Display URLs
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "              APPLICATION URLS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Backend API:    http://localhost:8080" -ForegroundColor White
Write-Host "Frontend App:   http://localhost:5173" -ForegroundColor White
Write-Host "H2 Console:     http://localhost:8080/h2-console" -ForegroundColor White
Write-Host "  JDBC URL:     jdbc:h2:file:./data/equipmentdb" -ForegroundColor Gray
Write-Host "  Username:     sa" -ForegroundColor Gray
Write-Host "  Password:     (empty)" -ForegroundColor Gray

# Ask to start frontend
Write-Host "`n============================================" -ForegroundColor Cyan
$startFrontend = Read-Host "Start frontend dev server? (y/n)"
if ($startFrontend -eq 'y') {
    Write-Host "`n🚀 Starting frontend..." -ForegroundColor Green
    Write-Host "Frontend will open at http://localhost:5173" -ForegroundColor Cyan
    Write-Host "`nPress Ctrl+C to stop the dev server`n" -ForegroundColor Yellow
    npm run dev
} else {
    Write-Host "`nTo start frontend manually:" -ForegroundColor Yellow
    Write-Host "  npm run dev`n" -ForegroundColor White
}
