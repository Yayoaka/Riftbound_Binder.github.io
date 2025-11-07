# Riftbound Binder

Un classeur digital pour les cartes du jeu Riftbound. Suivez votre collection de cartes sans avoir besoin d'avoir votre classeur physique sur vous !

## 🎯 Fonctionnalités

- 📚 Affichage de toutes les cartes du set Origin en grille
- ✅ Système de checkboxes pour marquer les cartes possédées
- 💾 Sauvegarde automatique de votre collection dans le navigateur (localStorage)
- 🔍 Filtres : Toutes / Possédées / Manquantes
- 📄 Pagination configurable (12, 16 ou 32 cartes par page)
- 🖼️ Modal de détail avec visuel complet et informations de chaque carte
- 📱 Design responsive et moderne

## 🚀 Installation

1. Clonez le repository ou téléchargez les fichiers
2. Installez les dépendances :

```bash
npm install
```

## 📥 Récupération des données des cartes

Pour récupérer les données des cartes depuis le site officiel Riftbound, exécutez le scraper :

```bash
npm run scrape
```

Cela va créer le fichier `src/data/origins_cards_sample.json` avec toutes les informations des cartes.

**Note :** Le scraper utilise Puppeteer et peut prendre quelques minutes. Assurez-vous d'avoir une connexion internet stable.

## 🎮 Utilisation

1. Démarrez le serveur de développement :

```bash
npm run dev
```

2. Ouvrez votre navigateur à l'adresse indiquée (généralement `http://localhost:5173`)

3. Utilisez les contrôles en haut de la page pour :
   - Choisir le nombre de cartes par page (12, 16 ou 32)
   - Filtrer les cartes (Toutes, Possédées, Manquantes)
   - Voir les statistiques de votre collection

4. Cliquez sur une carte pour voir ses détails complets

5. Cochez/décochez les cartes que vous possédez - votre collection est sauvegardée automatiquement !

## 🏗️ Structure du projet

```
riftbound-binder/
├── src/
│   ├── components/
│   │   ├── BinderWithJSON.jsx    # Composant principal avec grille et pagination
│   │   ├── BinderWithJSON.css
│   │   ├── CardModal.jsx         # Modal de détail de carte
│   │   └── CardModal.css
│   ├── data/
│   │   └── origins_cards_sample.json  # Données des cartes (généré par le scraper)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tools/
│   └── scrape-riftbound.js       # Scraper pour récupérer les cartes
├── package.json
└── vite.config.js
```

## 🛠️ Technologies utilisées

- **React** - Framework UI
- **Vite** - Build tool et serveur de développement
- **Puppeteer** - Scraping web
- **CSS3** - Styles modernes avec animations

## 📝 Notes

- Les données de votre collection sont stockées localement dans le navigateur (localStorage)
- Si vous changez de navigateur ou effacez les données, vous devrez recocher vos cartes
- Le scraper peut nécessiter des ajustements si le site Riftbound change sa structure

## 🎨 Personnalisation

Vous pouvez facilement personnaliser :
- Les couleurs dans les fichiers CSS
- Le nombre de cartes par page (ajoutez des options dans le select)
- Le design des cartes dans `BinderWithJSON.css`

## 📦 Build pour production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`.

## 🌐 Déploiement sur GitHub Pages (GRATUIT)

### Méthode 1 : Déploiement automatique avec script (Recommandé)

1. **Build et déployez en une commande :**
   ```bash
   npm run deploy
   ```
   
   Ce script va :
   - Builder votre projet
   - Créer/mettre à jour la branche `gh-pages`
   - Déployer automatiquement

2. **Activez GitHub Pages dans les paramètres :**
   - Allez dans `Settings` > `Pages` (gratuit pour repos publics)
   - Sous `Source`, sélectionnez la branche `gh-pages`
   - Cliquez sur `Save`

3. **Votre site sera disponible à :**
   `https://votre-username.github.io/Riftbound_Binder.github.io/`

### Méthode 2 : Déploiement manuel

1. **Build le projet :**
   ```bash
   npm run build
   ```

2. **Créez la branche gh-pages et déployez :**
   - Créez une branche `gh-pages` dans GitHub
   - Ou utilisez le script PowerShell : `.\deploy.ps1`

3. **Configurez GitHub Pages :**
   - `Settings` > `Pages`
   - Source : branche `gh-pages`
   - Dossier : `/ (root)`

### ⚠️ Important

- **GitHub Pages est GRATUIT** pour les repositories publics
- Si votre repo est privé, vous avez besoin d'un compte GitHub Pro (payant)
- Pour un repo public, tout est gratuit !

### ⚠️ Important pour GitHub Pages

- Le site sera **actif en permanence** une fois déployé
- Chaque push déclenchera un nouveau déploiement automatique
- Les données sauvegardées (localStorage) restent locales à chaque utilisateur
- Le scraper doit être exécuté en local, puis le fichier JSON doit être commité

---

Bon collectionnage ! 🎴
