# Add Thrissur village locations to equipment
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Adding Thrissur Village Locations" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Login as admin
$loginBody = @{
    email = "admin@village.com"
    password = "password"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token
$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "[OK] Logged in as admin" -ForegroundColor Green

# Get all equipment
$equipment = Invoke-RestMethod -Uri "http://localhost:8080/equipment" -Headers $headers
Write-Host "[OK] Found $($equipment.Length) equipment items`n" -ForegroundColor Green

# Thrissur village coordinates
$locations = @(
    @{ name = "Ollur"; lat = 10.5598; lng = 76.2144; city = "Ollur, Thrissur" }
    @{ name = "Wadakkanchery"; lat = 10.6169; lng = 76.1403; city = "Wadakkanchery, Thrissur" }
    @{ name = "Irinjalakuda"; lat = 10.3428; lng = 76.2147; city = "Irinjalakuda, Thrissur" }
    @{ name = "Chalakudy"; lat = 10.3051; lng = 76.3314; city = "Chalakudy, Thrissur" }
    @{ name = "Kodungallur"; lat = 10.2233; lng = 76.1997; city = "Kodungallur, Thrissur" }
    @{ name = "Guruvayur"; lat = 10.5944; lng = 76.0392; city = "Guruvayur, Thrissur" }
)

# Update each equipment with a location
$index = 0
foreach ($item in $equipment) {
    $location = $locations[$index % $locations.Length]
    
    # Prepare update body with location
    $updateBody = @{
        name = $item.name
        description = $item.description
        category = $item.category
        pricePerDay = $item.pricePerDay
        available = $item.available
        status = $item.status
        imageUrl = $item.imageUrl
        demo = $item.demo
        location = @{
            latitude = $location.lat
            longitude = $location.lng
            city = $location.city
        }
    } | ConvertTo-Json -Depth 3
    
    try {
        Invoke-RestMethod -Uri "http://localhost:8080/equipment/$($item.id)" -Method PUT -Headers $headers -Body $updateBody | Out-Null
        Write-Host "[OK] $($item.name) -> $($location.city)" -ForegroundColor Green
    } catch {
        Write-Host "[FAIL] Failed to update $($item.name): $_" -ForegroundColor Red
    }
    
    $index++
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Equipment locations updated!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nView the map at: http://localhost:3000/map" -ForegroundColor Yellow
Write-Host "(Login first with admin@village.com / password)`n" -ForegroundColor Yellow
