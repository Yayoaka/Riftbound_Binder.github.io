import React, { useState, useEffect } from 'react'
import CardModal from './CardModal'
import './BinderWithJSON.css'

function BinderWithJSON() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCard, setSelectedCard] = useState(null)
  const [ownedCards, setOwnedCards] = useState(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [cardsPerPage, setCardsPerPage] = useState(16)
  const [filterOwned, setFilterOwned] = useState('all') // 'all', 'owned', 'missing'

  // Charger les cartes depuis le JSON
  useEffect(() => {
    const loadCards = async () => {
      try {
        // Chemin pour GitHub Pages (fichier dans public/)
        const response = await fetch('/origins_cards_sample.json')
        const data = await response.json()
        setCards(data)
      } catch (error) {
        console.error('Erreur lors du chargement des cartes:', error)
        // Si le fichier n'existe pas, utiliser des données d'exemple
        setCards([])
      } finally {
        setLoading(false)
      }
    }
    loadCards()
  }, [])

  // Charger les cartes possédées depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('riftbound-owned-cards')
    if (saved) {
      try {
        setOwnedCards(new Set(JSON.parse(saved)))
      } catch (error) {
        console.error('Erreur lors du chargement des cartes possédées:', error)
      }
    }
  }, [])

  // Sauvegarder les cartes possédées dans localStorage
  const toggleCardOwned = (cardId) => {
    const newOwned = new Set(ownedCards)
    if (newOwned.has(cardId)) {
      newOwned.delete(cardId)
    } else {
      newOwned.add(cardId)
    }
    setOwnedCards(newOwned)
    localStorage.setItem('riftbound-owned-cards', JSON.stringify([...newOwned]))
  }

  // Filtrer les cartes selon le filtre sélectionné
  const filteredCards = cards.filter(card => {
    if (filterOwned === 'owned') return ownedCards.has(card.id)
    if (filterOwned === 'missing') return !ownedCards.has(card.id)
    return true
  })

  // Calculer la pagination
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage)
  const startIndex = (currentPage - 1) * cardsPerPage
  const endIndex = startIndex + cardsPerPage
  const currentCards = filteredCards.slice(startIndex, endIndex)

  // Réinitialiser à la page 1 quand on change le filtre ou le nombre de cartes par page
  useEffect(() => {
    setCurrentPage(1)
  }, [filterOwned, cardsPerPage])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des cartes...</p>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="empty-state">
        <h2>Aucune carte trouvée</h2>
        <p>Veuillez exécuter le scraper pour récupérer les cartes :</p>
        <code>npm run scrape</code>
      </div>
    )
  }

  return (
    <div className="binder-container">
      {/* Contrôles */}
      <div className="binder-controls">
        <div className="controls-group">
          <label>
            Cartes par page:
            <select 
              value={cardsPerPage} 
              onChange={(e) => setCardsPerPage(Number(e.target.value))}
            >
              <option value={12}>12</option>
              <option value={16}>16</option>
              <option value={32}>32</option>
            </select>
          </label>
        </div>

        <div className="controls-group">
          <label>
            Filtrer:
            <select 
              value={filterOwned} 
              onChange={(e) => setFilterOwned(e.target.value)}
            >
              <option value="all">Toutes</option>
              <option value="owned">Possédées</option>
              <option value="missing">Manquantes</option>
            </select>
          </label>
        </div>

        <div className="stats">
          <span>Total: {cards.length}</span>
          <span>Possédées: {ownedCards.size}</span>
          <span>Manquantes: {cards.length - ownedCards.size}</span>
        </div>
      </div>

      {/* Grille de cartes */}
      <div className="cards-grid" style={{ '--cards-per-row': Math.ceil(Math.sqrt(cardsPerPage)) }}>
        {currentCards.map((card) => (
          <div
            key={card.id}
            className={`card-wrapper ${ownedCards.has(card.id) ? 'owned' : ''}`}
            onClick={() => setSelectedCard(card)}
          >
            <div className="card-checkbox-container">
              <input
                type="checkbox"
                checked={ownedCards.has(card.id)}
                onChange={(e) => {
                  e.stopPropagation()
                  toggleCardOwned(card.id)
                }}
                className="card-checkbox"
              />
            </div>
            <div className="card-image-container">
              <img
                src={card.imageUrl}
                alt={card.name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200x280?text=Card'
                }}
              />
            </div>
            <div className="card-name">{card.name}</div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <span>
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      )}

      {/* Modal de détail */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          isOwned={ownedCards.has(selectedCard.id)}
          onClose={() => setSelectedCard(null)}
          onToggleOwned={() => toggleCardOwned(selectedCard.id)}
        />
      )}
    </div>
  )
}

export default BinderWithJSON

