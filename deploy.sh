#!/bin/bash
# Script de déploiement manuel pour GitHub Pages

echo "🔨 Building the project..."
npm run build

echo "📦 Copying files to gh-pages branch..."
# Créer la branche gh-pages si elle n'existe pas
git checkout --orphan gh-pages 2>/dev/null || git checkout gh-pages

# Supprimer tous les fichiers sauf .git
git rm -rf . 2>/dev/null || true

# Copier les fichiers du build
cp -r dist/* .

# Ajouter et commiter
git add .
git commit -m "Deploy to GitHub Pages"

echo "🚀 Pushing to GitHub..."
git push origin gh-pages --force

# Revenir à la branche main
git checkout main

echo "✅ Déploiement terminé !"
echo "🌐 Votre site sera disponible dans quelques minutes sur :"
echo "   https://votre-username.github.io/Riftbound_Binder.github.io/"

