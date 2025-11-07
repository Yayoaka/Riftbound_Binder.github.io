# Script de déploiement PowerShell pour GitHub Pages (Windows)

Write-Host "🔨 Building the project..." -ForegroundColor Cyan
npm run build

Write-Host "📦 Preparing deployment..." -ForegroundColor Cyan

# Sauvegarder la branche actuelle
$currentBranch = git branch --show-current

# Créer ou basculer vers la branche gh-pages
Write-Host "🌿 Switching to gh-pages branch..." -ForegroundColor Cyan
git checkout gh-pages 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating new gh-pages branch..." -ForegroundColor Yellow
    git checkout --orphan gh-pages
}

# Supprimer tous les fichiers sauf .git
Write-Host "🧹 Cleaning old files..." -ForegroundColor Cyan
Get-ChildItem -Path . -Exclude .git | Remove-Item -Recurse -Force

# Copier les fichiers du build
Write-Host "📋 Copying build files..." -ForegroundColor Cyan
Copy-Item -Path "dist\*" -Destination . -Recurse -Force

# Ajouter et commiter
Write-Host "💾 Committing changes..." -ForegroundColor Cyan
git add .
git commit -m "Deploy to GitHub Pages" 2>$null

# Push vers GitHub
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan
git push origin gh-pages --force

# Revenir à la branche principale
Write-Host "🔄 Switching back to $currentBranch..." -ForegroundColor Cyan
git checkout $currentBranch

Write-Host "✅ Déploiement terminé !" -ForegroundColor Green
Write-Host "🌐 Votre site sera disponible dans quelques minutes sur :" -ForegroundColor Yellow
Write-Host "   https://votre-username.github.io/Riftbound_Binder.github.io/" -ForegroundColor Yellow

