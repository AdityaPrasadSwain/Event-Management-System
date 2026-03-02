$basePath = "target/classes/com/sems"
$files = @(
    "$basePath/controller/AdminController.class",
    "$basePath/service/UserService.class",
    "$basePath/service/impl/UserServiceImpl.class"
)

$allFound = $true

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ Found: $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: $file" -ForegroundColor Red
        $allFound = $false
    }
}

if ($allFound) {
    Write-Host "`n✅ All required classes verified successfully!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Verification FAILED: Some classes are missing." -ForegroundColor Red
    exit 1
}
