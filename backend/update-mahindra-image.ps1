# Update Mahindra Equipment Image
# This script updates the Mahindra tractor image to the new URL

$baseUrl = "http://localhost:8080"
$newMahindraImage = "https://assets.tractorjunction.com/tractor-junction/assets/images/tractor-images/tractor-image-0-1731604906.webp"

Write-Host "🔄 Updating Mahindra equipment images..." -ForegroundColor Cyan

# Login as admin to get token
$loginBody = @{
    email = "admin@village.com"
    password = "password"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token

Write-Host "✅ Logged in as admin" -ForegroundColor Green

# Get all equipment
$headers = @{
    Authorization = "Bearer $token"
}

$allEquipment = Invoke-RestMethod -Uri "$baseUrl/equipment" -Method Get -Headers $headers

# Find and update Mahindra equipment
$mahindraEquipment = $allEquipment | Where-Object { $_.name -like "*Mahindra*" }

if ($mahindraEquipment) {
    foreach ($equipment in $mahindraEquipment) {
        Write-Host "📝 Updating: $($equipment.name) (ID: $($equipment.id))" -ForegroundColor Yellow
        
        # Update image
        $equipment.image = $newMahindraImage
        
        # Send update request
        $updateBody = $equipment | ConvertTo-Json -Depth 10
        
        try {
            $updated = Invoke-RestMethod -Uri "$baseUrl/equipment/$($equipment.id)" -Method Put -Body $updateBody -ContentType "application/json" -Headers $headers
            Write-Host "   ✅ Updated successfully" -ForegroundColor Green
            Write-Host "   🖼️  New image: $($updated.image)" -ForegroundColor Cyan
        } catch {
            Write-Host "   ❌ Failed to update: $_" -ForegroundColor Red
        }
    }
    
    Write-Host "`n🎉 All Mahindra equipment updated!" -ForegroundColor Green
} else {
    Write-Host "⚠️  No Mahindra equipment found in database" -ForegroundColor Yellow
}

# Also update demo and seeded equipment by running seed endpoints
Write-Host "`n🌱 Re-running seed to ensure new equipment gets new images..." -ForegroundColor Cyan

try {
    $demoSeed = Invoke-RestMethod -Uri "$baseUrl/admin/seed-demo" -Method Post -Headers $headers
    Write-Host "✅ Demo seed: $demoSeed" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  Demo seed: $_" -ForegroundColor Gray
}

try {
    $realisticSeed = Invoke-RestMethod -Uri "$baseUrl/admin/seed-realistic" -Method Post -Headers $headers
    Write-Host "✅ Realistic seed: $realisticSeed" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  Realistic seed: $_" -ForegroundColor Gray
}

Write-Host "`n✨ Done! Mahindra equipment now uses the new image." -ForegroundColor Green
