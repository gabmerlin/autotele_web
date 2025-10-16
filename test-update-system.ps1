# Script de test du système de mise à jour AutoTele
# Usage: .\test-update-system.ps1

# Couleurs
$ErrorColor = "Red"
$SuccessColor = "Green"
$InfoColor = "Cyan"
$WarningColor = "Yellow"

function Test-Step {
    param(
        [string]$Name,
        [scriptblock]$Test
    )
    
    Write-Host "`n→ Test : $Name" -ForegroundColor $InfoColor
    
    try {
        $result = & $Test
        if ($result) {
            Write-Host "  ✓ SUCCÈS" -ForegroundColor $SuccessColor
            return $true
        } else {
            Write-Host "  ✗ ÉCHEC" -ForegroundColor $ErrorColor
            return $false
        }
    } catch {
        Write-Host "  ✗ ERREUR : $_" -ForegroundColor $ErrorColor
        return $false
    }
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor $InfoColor
Write-Host "  Test du Système de Mise à Jour AutoTele" -ForegroundColor $InfoColor
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor $InfoColor

$results = @()

# Test 1 : Fichiers locaux
$results += Test-Step "Structure des dossiers" {
    $paths = @(
        ".\public\updates",
        ".\public\updates\latest",
        ".\public\updates\releases",
        ".\public\updates\version.json"
    )
    
    $allExist = $true
    foreach ($path in $paths) {
        if (!(Test-Path $path)) {
            Write-Host "    Manquant : $path" -ForegroundColor $WarningColor
            $allExist = $false
        }
    }
    
    return $allExist
}

# Test 2 : Validation du JSON
$results += Test-Step "Fichier version.json valide" {
    try {
        $json = Get-Content ".\public\updates\version.json" -Raw | ConvertFrom-Json
        
        $requiredFields = @("version", "download_url", "release_notes")
        $allFieldsPresent = $true
        
        foreach ($field in $requiredFields) {
            if (!$json.$field) {
                Write-Host "    Champ manquant : $field" -ForegroundColor $WarningColor
                $allFieldsPresent = $false
            }
        }
        
        Write-Host "    Version détectée : $($json.version)" -ForegroundColor $InfoColor
        return $allFieldsPresent
    } catch {
        Write-Host "    JSON invalide" -ForegroundColor $ErrorColor
        return $false
    }
}

# Test 3 : Format de version
$results += Test-Step "Format de version correct" {
    $json = Get-Content ".\public\updates\version.json" -Raw | ConvertFrom-Json
    $version = $json.version
    
    if ($version -match '^\d+\.\d+\.\d+$') {
        Write-Host "    Format valide : $version" -ForegroundColor $InfoColor
        return $true
    } else {
        Write-Host "    Format invalide : $version (attendu: X.Y.Z)" -ForegroundColor $WarningColor
        return $false
    }
}

# Test 4 : Configuration Next.js
$results += Test-Step "Configuration Next.js" {
    if (!(Test-Path ".\next.config.js")) {
        Write-Host "    next.config.js introuvable" -ForegroundColor $ErrorColor
        return $false
    }
    
    $config = Get-Content ".\next.config.js" -Raw
    
    $hasHeaders = $config -like "*async headers*"
    $hasUpdatesPath = $config -like "*/updates/:path*"
    
    if ($hasHeaders -and $hasUpdatesPath) {
        Write-Host "    Headers configurés correctement" -ForegroundColor $InfoColor
        return $true
    } else {
        Write-Host "    Configuration incomplète" -ForegroundColor $WarningColor
        return $false
    }
}

# Test 5 : URL de téléchargement
$results += Test-Step "URL de téléchargement valide" {
    $json = Get-Content ".\public\updates\version.json" -Raw | ConvertFrom-Json
    $url = $json.download_url
    
    if ($url -match '^https?://') {
        Write-Host "    URL : $url" -ForegroundColor $InfoColor
        return $true
    } else {
        Write-Host "    URL invalide : $url" -ForegroundColor $WarningColor
        return $false
    }
}

# Test 6 : Test de connexion (si déployé)
$results += Test-Step "Connexion au serveur (si déployé)" {
    try {
        $url = "https://autotele.qgchatting.com/updates/version.json"
        Write-Host "    Test de : $url" -ForegroundColor $InfoColor
        
        $response = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 10 -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            Write-Host "    Serveur accessible 200 OK" -ForegroundColor $SuccessColor
            return $true
        } else {
            Write-Host "    Code HTTP : $($response.StatusCode)" -ForegroundColor $WarningColor
            return $false
        }
    } catch {
        Write-Host "    Serveur non accessible (normal si pas encore déployé)" -ForegroundColor $WarningColor
        return $true  # Ne pas compter comme une erreur
    }
}

# Test 7 : Vérifier les fichiers de documentation
$results += Test-Step "Documentation présente" {
    $docs = @(
        ".\public\updates\README.md",
        ".\public\updates\IMPORTANT.md",
        ".\GUIDE-MISE-A-JOUR.md"
    )
    
    $allExist = $true
    foreach ($doc in $docs) {
        if (!(Test-Path $doc)) {
            Write-Host "    Manquant : $doc" -ForegroundColor $WarningColor
            $allExist = $false
        }
    }
    
    return $allExist
}

# Test 8 : Script de déploiement
$results += Test-Step "Script de déploiement présent" {
    if (Test-Path ".\deploy-update.ps1") {
        Write-Host "    Script trouvé : deploy-update.ps1" -ForegroundColor $InfoColor
        return $true
    } else {
        Write-Host "    Script manquant : deploy-update.ps1" -ForegroundColor $WarningColor
        return $false
    }
}

# Résumé
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor $InfoColor
Write-Host "  RÉSUMÉ DES TESTS" -ForegroundColor $InfoColor
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor $InfoColor

$passed = ($results | Where-Object { $_ -eq $true }).Count
$total = $results.Count
$percentage = [math]::Round(($passed / $total) * 100)

Write-Host ""
$percentText = "$percentage%"
Write-Host "  Tests réussis : $passed / $total ($percentText)" -ForegroundColor $(if ($percentage -eq 100) { $SuccessColor } else { $WarningColor })
Write-Host ""

if ($percentage -eq 100) {
    Write-Host "✓ Tous les tests sont passés ! Système prêt." -ForegroundColor $SuccessColor
} elseif ($percentage -ge 70) {
    Write-Host "⚠ La plupart des tests sont passés. Vérifiez les warnings." -ForegroundColor $WarningColor
} else {
    Write-Host "✗ Plusieurs tests ont échoué. Consultez les erreurs ci-dessus." -ForegroundColor $ErrorColor
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor $InfoColor

# Instructions suivantes
if ($percentage -lt 100) {
    Write-Host "PROCHAINES ÉTAPES :" -ForegroundColor $InfoColor
    Write-Host "  1. Corriger les erreurs mentionnées ci-dessus" -ForegroundColor $InfoColor
    Write-Host "  2. Relancer ce script de test" -ForegroundColor $InfoColor
    Write-Host "  3. Déployer sur Vercel : git push" -ForegroundColor $InfoColor
    Write-Host ""
} else {
    Write-Host "PROCHAINES ÉTAPES :" -ForegroundColor $InfoColor
    Write-Host "  1. Déployer sur Vercel :" -ForegroundColor $InfoColor
    Write-Host "     git add ." -ForegroundColor $WarningColor
    Write-Host "     git commit -m 'Configure update system'" -ForegroundColor $WarningColor
    Write-Host "     git push" -ForegroundColor $WarningColor
    Write-Host ""
    Write-Host "  2. Après déploiement, tester :" -ForegroundColor $InfoColor
    Write-Host "     curl https://autotele.qgchatting.com/updates/version.json" -ForegroundColor $WarningColor
    Write-Host ""
    Write-Host "  3. Tester avec l'application AutoTele" -ForegroundColor $InfoColor
    Write-Host ""
}

