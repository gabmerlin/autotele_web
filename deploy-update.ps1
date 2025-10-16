# Script de déploiement automatique des mises à jour AutoTele
# Usage: .\deploy-update.ps1 -Version "2.2.0" -ExePath "C:\path\to\AutoTele-Setup-v2.2.0.exe"

param(
    [Parameter(Mandatory=$true)]
    [string]$Version,
    
    [Parameter(Mandatory=$false)]
    [string]$ExePath = "",
    
    [Parameter(Mandatory=$false)]
    [string]$ReleaseNotes = "Nouvelle version disponible",
    
    [Parameter(Mandatory=$false)]
    [bool]$Required = $false,
    
    [Parameter(Mandatory=$false)]
    [string]$DownloadUrl = ""
)

# Couleurs pour le terminal
$ErrorColor = "Red"
$SuccessColor = "Green"
$InfoColor = "Cyan"
$WarningColor = "Yellow"

function Write-Step {
    param([string]$Message)
    Write-Host "`n✓ $Message" -ForegroundColor $SuccessColor
}

function Write-Info {
    param([string]$Message)
    Write-Host "  → $Message" -ForegroundColor $InfoColor
}

function Write-Warning {
    param([string]$Message)
    Write-Host "  ⚠ $Message" -ForegroundColor $WarningColor
}

function Write-Error {
    param([string]$Message)
    Write-Host "  ✗ $Message" -ForegroundColor $ErrorColor
}

# Début du script
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor $InfoColor
Write-Host "  AutoTele - Déploiement Mise à Jour v$Version" -ForegroundColor $InfoColor
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor $InfoColor

# 1. Vérification des prérequis
Write-Step "Vérification des prérequis..."

$updatesPath = ".\public\updates"
if (!(Test-Path $updatesPath)) {
    Write-Error "Dossier 'public/updates' introuvable"
    exit 1
}

$versionJsonPath = "$updatesPath\version.json"
if (!(Test-Path $versionJsonPath)) {
    Write-Error "Fichier 'version.json' introuvable"
    exit 1
}

Write-Info "Dossier updates trouvé"

# 2. Créer le dossier de la version
Write-Step "Création du dossier de version..."

$versionFolder = "$updatesPath\releases\v$Version"
if (!(Test-Path $versionFolder)) {
    New-Item -ItemType Directory -Path $versionFolder -Force | Out-Null
    Write-Info "Dossier créé : $versionFolder"
} else {
    Write-Warning "Le dossier existe déjà : $versionFolder"
}

# 3. Copier le fichier .exe si fourni
if ($ExePath -ne "" -and (Test-Path $ExePath)) {
    Write-Step "Copie du fichier .exe..."
    
    $fileName = "AutoTele-Setup-v$Version.exe"
    
    # Copier dans releases/vX.X.X
    Copy-Item $ExePath "$versionFolder\$fileName" -Force
    Write-Info "Copié dans : $versionFolder\$fileName"
    
    # Copier dans latest/
    $latestFolder = "$updatesPath\latest"
    if (!(Test-Path $latestFolder)) {
        New-Item -ItemType Directory -Path $latestFolder -Force | Out-Null
    }
    Copy-Item $ExePath "$latestFolder\$fileName" -Force
    Write-Info "Copié dans : $latestFolder\$fileName"
    
    # Calculer la taille du fichier
    $fileSize = [math]::Round((Get-Item $ExePath).Length / 1MB, 1)
    Write-Info "Taille du fichier : $fileSize MB"
    
    # Vérifier la limite Vercel
    if ($fileSize -gt 100) {
        Write-Warning "⚠ ATTENTION : Le fichier dépasse 100 MB (limite Vercel)"
        Write-Warning "   Il est recommandé d'utiliser GitHub Releases ou Cloudflare R2"
        Write-Warning "   Le fichier a été copié localement mais ne sera pas déployé sur Vercel"
    }
} else {
    Write-Warning "Aucun fichier .exe fourni ou fichier introuvable"
    Write-Info "Vous devrez héberger le fichier manuellement (GitHub Releases, R2, etc.)"
}

# 4. Mettre à jour version.json
Write-Step "Mise à jour de version.json..."

$currentDate = Get-Date -Format "yyyy-MM-dd"

# Lire le fichier actuel
$versionData = Get-Content $versionJsonPath -Raw | ConvertFrom-Json

# Déterminer l'URL de téléchargement
if ($DownloadUrl -eq "") {
    # Par défaut, utiliser GitHub Releases
    $DownloadUrl = "https://github.com/gabmerlin/autotele_app/releases/download/v$Version/AutoTele-Setup-v$Version.exe"
    Write-Info "URL de téléchargement (GitHub) : $DownloadUrl"
} else {
    Write-Info "URL de téléchargement personnalisée : $DownloadUrl"
}

# Mettre à jour les valeurs
$versionData.version = $Version
$versionData.build = (Get-Date -Format "yyyyMMdd")
$versionData.download_url = $DownloadUrl
$versionData.direct_exe_url = $DownloadUrl
$versionData.release_notes = $ReleaseNotes
$versionData.required = $Required
$versionData.release_date = $currentDate

# Sauvegarder
$versionData | ConvertTo-Json -Depth 10 | Set-Content $versionJsonPath -Encoding UTF8

Write-Info "version.json mis à jour avec succès"

# 5. Afficher le résumé
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor $InfoColor
Write-Host "  RÉSUMÉ DE LA MISE À JOUR" -ForegroundColor $InfoColor
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor $InfoColor
Write-Host ""
Write-Host "  Version          : $Version" -ForegroundColor $SuccessColor
Write-Host "  Date             : $currentDate" -ForegroundColor $InfoColor
Write-Host "  URL              : $DownloadUrl" -ForegroundColor $InfoColor
Write-Host "  Obligatoire      : $Required" -ForegroundColor $(if ($Required) { $ErrorColor } else { $InfoColor })
Write-Host "  Notes            : $ReleaseNotes" -ForegroundColor $InfoColor
Write-Host ""

# 6. Proposer de commiter
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor $InfoColor

$commit = Read-Host "Voulez-vous commiter et pusher les changements ? (O/N)"
if ($commit -eq "O" -or $commit -eq "o") {
    Write-Step "Git commit et push..."
    
    git add .
    git commit -m "Release v$Version"
    git push
    
    Write-Info "Changements poussés vers le dépôt"
    Write-Info "Vercel va déployer automatiquement"
    
    Write-Host "`n✓ Déploiement lancé ! Vérifiez Vercel dans quelques minutes." -ForegroundColor $SuccessColor
} else {
    Write-Warning "Changements non commités. Pensez à faire :"
    Write-Host "    git add ."
    Write-Host "    git commit -m 'Release v$Version'"
    Write-Host "    git push"
}

# 7. Instructions de vérification
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor $InfoColor
Write-Host "  PROCHAINES ÉTAPES" -ForegroundColor $InfoColor
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor $InfoColor
Write-Host ""
Write-Host "  1. Attendre le déploiement Vercel (2-3 min)" -ForegroundColor $InfoColor
Write-Host ""
Write-Host "  2. Tester l'URL du JSON :" -ForegroundColor $InfoColor
Write-Host "     curl https://autotele.qgchatting.com/updates/version.json" -ForegroundColor $WarningColor
Write-Host ""
Write-Host "  3. Tester le téléchargement :" -ForegroundColor $InfoColor
Write-Host "     curl -I $DownloadUrl" -ForegroundColor $WarningColor
Write-Host ""
Write-Host "  4. Tester avec l'application AutoTele" -ForegroundColor $InfoColor
Write-Host "     (Menu → Paramètres → Vérifier les mises à jour)" -ForegroundColor $InfoColor
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor $InfoColor

Write-Host "✓ Script terminé avec succès !`n" -ForegroundColor $SuccessColor

