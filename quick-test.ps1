# Test rapide du systeme de mise a jour
Write-Host "`n=== Test du Systeme de Mise a Jour AutoTele ===" -ForegroundColor Cyan

$allOk = $true

# Test 1: Structure
Write-Host "`n1. Structure des dossiers..." -ForegroundColor Yellow
if (Test-Path ".\public\updates\version.json") {
    Write-Host "   [OK] version.json present" -ForegroundColor Green
} else {
    Write-Host "   [ERREUR] version.json manquant" -ForegroundColor Red
    $allOk = $false
}

if (Test-Path ".\public\updates\latest") {
    Write-Host "   [OK] Dossier latest present" -ForegroundColor Green
} else {
    Write-Host "   [ERREUR] Dossier latest manquant" -ForegroundColor Red
    $allOk = $false
}

if (Test-Path ".\public\updates\releases") {
    Write-Host "   [OK] Dossier releases present" -ForegroundColor Green
} else {
    Write-Host "   [ERREUR] Dossier releases manquant" -ForegroundColor Red
    $allOk = $false
}

# Test 2: JSON valide
Write-Host "`n2. Validation du JSON..." -ForegroundColor Yellow
try {
    $json = Get-Content ".\public\updates\version.json" -Raw | ConvertFrom-Json
    Write-Host "   [OK] JSON valide" -ForegroundColor Green
    Write-Host "   Version: $($json.version)" -ForegroundColor Cyan
    Write-Host "   URL: $($json.download_url)" -ForegroundColor Cyan
} catch {
    Write-Host "   [ERREUR] JSON invalide" -ForegroundColor Red
    $allOk = $false
}

# Test 3: Configuration Next.js
Write-Host "`n3. Configuration Next.js..." -ForegroundColor Yellow
if (Test-Path ".\next.config.js") {
    $config = Get-Content ".\next.config.js" -Raw
    if ($config -like "*headers*" -and $config -like "*updates*") {
        Write-Host "   [OK] Headers configures" -ForegroundColor Green
    } else {
        Write-Host "   [AVERTISSEMENT] Headers peut-etre manquants" -ForegroundColor Yellow
    }
} else {
    Write-Host "   [ERREUR] next.config.js introuvable" -ForegroundColor Red
    $allOk = $false
}

# Test 4: Documentation
Write-Host "`n4. Documentation..." -ForegroundColor Yellow
$docs = @(
    ".\GUIDE-MISE-A-JOUR.md",
    ".\public\updates\README.md",
    ".\deploy-update.ps1"
)
foreach ($doc in $docs) {
    if (Test-Path $doc) {
        Write-Host "   [OK] $(Split-Path $doc -Leaf)" -ForegroundColor Green
    } else {
        Write-Host "   [AVERTISSEMENT] $(Split-Path $doc -Leaf) manquant" -ForegroundColor Yellow
    }
}

# Test 5: Test connexion serveur
Write-Host "`n5. Test connexion serveur..." -ForegroundColor Yellow
try {
    $url = "https://autotele.qgchatting.com/updates/version.json"
    $response = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   [OK] Serveur accessible" -ForegroundColor Green
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Cyan
} catch {
    Write-Host "   [INFO] Serveur non accessible (normal si pas deploye)" -ForegroundColor Yellow
}

# Resultat final
Write-Host "`n============================================" -ForegroundColor Cyan
if ($allOk) {
    Write-Host "[SUCCES] Tous les tests critiques sont passes!" -ForegroundColor Green
    Write-Host "`nProchaines etapes:" -ForegroundColor Cyan
    Write-Host "  1. git add ." -ForegroundColor White
    Write-Host "  2. git commit -m 'Configure update system'" -ForegroundColor White
    Write-Host "  3. git push" -ForegroundColor White
} else {
    Write-Host "[ERREUR] Certains tests ont echoue" -ForegroundColor Red
    Write-Host "Verifiez les erreurs ci-dessus avant de deployer" -ForegroundColor Yellow
}
Write-Host "============================================`n" -ForegroundColor Cyan


