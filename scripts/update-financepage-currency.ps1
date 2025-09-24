$ErrorActionPreference = 'Stop'
$path = "c:\Users\user\Desktop\agri-dom-0631\src\pages\FinancePage.tsx"
if (-Not (Test-Path $path)) { throw "File not found: $path" }
$content = Get-Content -Raw $path
# Replace currency code
$content = $content -replace "currency:\s*'EUR'", "currency: 'KES'"
# Replace locale
$content = $content -replace "'en-GB'", "'en-KE'"
Set-Content -NoNewline -Path $path -Value $content
Write-Host "Updated currency and locale in FinancePage.tsx"
