import React from 'react'
import './CardModal.css'

function CardModal({ card, isOwned, onClose, onToggleOwned }) {
  if (!card) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="modal-card-container">
          <div className="modal-card-image">
            <img
              src={card.imageUrl}
              alt={card.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x560?text=Card'
              }}
            />
          </div>
          
          <div className="modal-card-info">
            <h2>{card.name}</h2>
            
            <div className="modal-card-details">
              {card.cost && (
                <div className="detail-item">
                  <span className="detail-label">Coût:</span>
                  <span className="detail-value">{card.cost}</span>
                </div>
              )}
              
              {card.rarity && (
                <div className="detail-item">
                  <span className="detail-label">Rareté:</span>
                  <span className="detail-value">{card.rarity}</span>
                </div>
              )}
              
              {card.set && (
                <div className="detail-item">
                  <span className="detail-label">Set:</span>
                  <span className="detail-value">{card.set}</span>
                </div>
              )}
            </div>
            
            {card.description && (
              <div className="modal-card-description">
                <h3>Description</h3>
                <p>{card.description}</p>
              </div>
            )}
            
            <div className="modal-card-actions">
              <label className="owned-toggle">
                <input
                  type="checkbox"
                  checked={isOwned}
                  onChange={onToggleOwned}
                />
                <span>Je possède cette carte</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardModal

