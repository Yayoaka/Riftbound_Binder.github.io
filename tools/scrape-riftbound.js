import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function scrapeRiftboundCards() {
  console.log('🚀 Démarrage du scraping...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('📄 Chargement de la page...');
    await page.goto('https://riftbound.leagueoflegends.com/en-us/card-gallery', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    // Attendre que les cartes soient chargées
    await page.waitForSelector('.card', { timeout: 10000 }).catch(() => {
      console.log('⚠️ Sélecteur .card non trouvé, tentative avec d\'autres sélecteurs...');
    });
    
    console.log('🔍 Extraction des données des cartes...');
    
    // Extraire toutes les informations des cartes
    const cards = await page.evaluate(() => {
      const cardElements = document.querySelectorAll('[class*="card"], [data-card], img[alt*="card"], img[src*="card"]');
      const extractedCards = [];
      const seenIds = new Set();
      
      cardElements.forEach((element, index) => {
        try {
          // Essayer de trouver l'image de la carte
          const img = element.querySelector('img') || (element.tagName === 'IMG' ? element : null);
          if (!img || !img.src) return;
          
          // Extraire le nom (depuis alt, title, ou data attributes)
          const name = img.alt || 
                      element.getAttribute('data-name') || 
                      element.getAttribute('title') || 
                      element.querySelector('[class*="name"], [class*="title"]')?.textContent ||
                      `Card ${index + 1}`;
          
          // Extraire l'image
          const imageUrl = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
          
          // Créer un ID unique basé sur l'image ou le nom
          const cardId = imageUrl.split('/').pop().split('.')[0] || 
                        name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') ||
                        `card-${index}`;
          
          if (seenIds.has(cardId)) return;
          seenIds.add(cardId);
          
          // Essayer d'extraire d'autres informations
          const cardElement = element.closest('[class*="card"], [data-card]') || element;
          const description = cardElement.querySelector('[class*="description"], [class*="text"], [class*="flavor"]')?.textContent || '';
          const rarity = cardElement.querySelector('[class*="rarity"]')?.textContent || '';
          const cost = cardElement.querySelector('[class*="cost"], [class*="mana"]')?.textContent || '';
          
          extractedCards.push({
            id: cardId,
            name: name,
            imageUrl: imageUrl,
            description: description.trim(),
            rarity: rarity.trim(),
            cost: cost.trim(),
            set: 'Origin'
          });
        } catch (error) {
          console.error(`Erreur lors de l'extraction de la carte ${index}:`, error);
        }
      });
      
      return extractedCards;
    });
    
    // Si la méthode précédente ne fonctionne pas, essayer une approche différente
    if (cards.length === 0) {
      console.log('🔄 Tentative avec une approche alternative...');
      
      const alternativeCards = await page.evaluate(() => {
        // Chercher toutes les images qui semblent être des cartes
        const images = Array.from(document.querySelectorAll('img'));
        const cardImages = images.filter(img => {
          const src = img.src || '';
          return src.includes('card') || src.includes('riftbound') || 
                 (img.alt && img.alt.length > 0) ||
                 (img.width && img.width > 100 && img.height && img.height > 100);
        });
        
        return cardImages.map((img, index) => ({
          id: `card-${index + 1}`,
          name: img.alt || `Card ${index + 1}`,
          imageUrl: img.src,
          description: '',
          rarity: '',
          cost: '',
          set: 'Origin'
        }));
      });
      
      cards.push(...alternativeCards);
    }
    
    console.log(`✅ ${cards.length} cartes trouvées`);
    
    // Sauvegarder dans le fichier JSON (public/ pour GitHub Pages)
    const publicPath = path.join(__dirname, '../public/origins_cards_sample.json');
    const srcPath = path.join(__dirname, '../src/data/origins_cards_sample.json');
    
    // Créer le dossier public s'il n'existe pas
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Sauvegarder dans les deux emplacements
    fs.writeFileSync(publicPath, JSON.stringify(cards, null, 2), 'utf-8');
    fs.writeFileSync(srcPath, JSON.stringify(cards, null, 2), 'utf-8');
    
    console.log(`💾 Données sauvegardées dans ${publicPath} et ${srcPath}`);
    console.log('✨ Scraping terminé avec succès!');
    
    return cards;
  } catch (error) {
    console.error('❌ Erreur lors du scraping:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Exécuter le scraping
scrapeRiftboundCards().catch(console.error);

