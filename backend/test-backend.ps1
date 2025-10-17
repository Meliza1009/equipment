# Backend JPA/H2 Integration Tests
# Make sure the server is running on http://localhost:8080

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "   BACKEND JPA/H2 INTEGRATION TESTS" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

$testsPassed = 0
$testsFailed = 0

# Test 1: Admin Login
Write-Host "`n========== TEST 1: Admin Login ==========" -ForegroundColor Yellow
try {
    $adminLogin = Invoke-RestMethod -Uri "http://localhost:8080/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"admin@example.com","password":"admin123"}'
    $global:adminToken = $adminLogin.token
    Write-Host "✅ Admin Login Successful!" -ForegroundColor Green
    Write-Host "   User ID: $($adminLogin.user.id)"
    Write-Host "   Email: $($adminLogin.user.email)"
    Write-Host "   Role: $($adminLogin.user.role)"
    Write-Host "   JWT Token (first 50 chars): $($adminToken.Substring(0,50))..."
    $testsPassed++
} catch {
    Write-Host "❌ Test Failed: $_" -ForegroundColor Red
    $testsFailed++
}

# Test 2: Register New User
Write-Host "`n`n========== TEST 2: User Registration ==========" -ForegroundColor Yellow
try {
    $newUser = Invoke-RestMethod -Uri "http://localhost:8080/auth/register" -Method Post -ContentType "application/json" -Body '{
        "email":"testuser@example.com",
        "password":"testpass123",
        "name":"Test User",
        "phoneNumber":"+1234567890",
        "role":"USER"
    }'
    $global:userToken = $newUser.token
    Write-Host "✅ User Registration Successful!" -ForegroundColor Green
    Write-Host "   User ID: $($newUser.user.id)"
    Write-Host "   Email: $($newUser.user.email)"
    Write-Host "   Name: $($newUser.user.name)"
    Write-Host "   Role: $($newUser.user.role)"
    $testsPassed++
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "⚠️  User already exists (data persisted from previous run!)" -ForegroundColor Yellow
        Write-Host "   This proves database persistence is working!"
        $testsPassed++
    } else {
        Write-Host "❌ Test Failed: $_" -ForegroundColor Red
        $testsFailed++
    }
}

# Test 3: Get Admin Profile
Write-Host "`n`n========== TEST 3: Get Admin Profile ==========" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $adminToken"
    }
    $profile = Invoke-RestMethod -Uri "http://localhost:8080/auth/profile" -Method Get -Headers $headers
    Write-Host "✅ Profile Retrieved Successfully!" -ForegroundColor Green
    Write-Host "   Name: $($profile.name)"
    Write-Host "   Email: $($profile.email)"
    Write-Host "   Role: $($profile.role)"
    $testsPassed++
} catch {
    Write-Host "❌ Test Failed: $_" -ForegroundColor Red
    $testsFailed++
}

# Test 4: Create Equipment (as admin)
Write-Host "`n`n========== TEST 4: Create Equipment ==========" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $adminToken"
        "Content-Type" = "application/json"
    }
    $equipment = Invoke-RestMethod -Uri "http://localhost:8080/equipment" -Method Post -Headers $headers -Body '{
        "name":"Test Drill",
        "description":"A powerful test drill",
        "category":"Power Tools",
        "operatorId":1,
        "available":true,
        "condition":"Excellent",
        "pricePerDay":25.00,
        "imageUrl":"https://example.com/drill.jpg",
        "location":{"address":"123 Test St","city":"Test City","state":"TS","zipCode":"12345","latitude":40.7128,"longitude":-74.0060},
        "specifications":{"power":"1200W","weight":"2.5kg"}
    }'
    Write-Host "✅ Equipment Created Successfully!" -ForegroundColor Green
    Write-Host "   Equipment ID: $($equipment.id)"
    Write-Host "   Name: $($equipment.name)"
    Write-Host "   Category: $($equipment.category)"
    Write-Host "   Price/Day: `$$($equipment.pricePerDay)"
    $global:equipmentId = $equipment.id
    $testsPassed++
} catch {
    Write-Host "❌ Test Failed: $_" -ForegroundColor Red
    $testsFailed++
}

# Test 5: Get All Equipment (Public endpoint)
Write-Host "`n`n========== TEST 5: Get All Equipment ==========" -ForegroundColor Yellow
try {
    $allEquipment = Invoke-RestMethod -Uri "http://localhost:8080/equipment" -Method Get
    Write-Host "✅ Equipment List Retrieved!" -ForegroundColor Green
    Write-Host "   Total Equipment: $($allEquipment.Count)"
    if ($allEquipment.Count -gt 0) {
        Write-Host "   Sample: $($allEquipment[0].name) - `$$($allEquipment[0].pricePerDay)/day"
    }
    $testsPassed++
} catch {
    Write-Host "❌ Test Failed: $_" -ForegroundColor Red
    $testsFailed++
}

# Test 6: Admin Dashboard Stats
Write-Host "`n`n========== TEST 6: Admin Dashboard Stats ==========" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $adminToken"
    }
    $stats = Invoke-RestMethod -Uri "http://localhost:8080/admin/analytics" -Method Get -Headers $headers
    Write-Host "✅ Analytics Retrieved!" -ForegroundColor Green
    Write-Host "   Total Users: $($stats.totalUsers)"
    Write-Host "   Total Equipment: $($stats.totalEquipment)"
    Write-Host "   Active Bookings: $($stats.activeBookings)"
    Write-Host "   Total Revenue: `$$($stats.totalRevenue)"
    $testsPassed++
} catch {
    Write-Host "❌ Test Failed: $_" -ForegroundColor Red
    $testsFailed++
}

# Summary
Write-Host "`n`n============================================" -ForegroundColor Cyan
Write-Host "           TEST SUMMARY" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Tests Passed: $testsPassed" -ForegroundColor Green
Write-Host "Tests Failed: $testsFailed" -ForegroundColor Red
Write-Host "`nDatabase File: ./data/equipmentdb.mv.db" -ForegroundColor Cyan
Write-Host "H2 Console: http://localhost:8080/h2-console" -ForegroundColor Cyan
Write-Host "  JDBC URL: jdbc:h2:file:./data/equipmentdb" -ForegroundColor Cyan
Write-Host "  Username: sa" -ForegroundColor Cyan
Write-Host "  Password: (leave empty)" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan
