import React from 'react'
import BinderWithJSON from './components/BinderWithJSON'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Riftbound Binder</h1>
        <p>Classeur digital pour les cartes Origin</p>
      </header>
      <BinderWithJSON />
    </div>
  )
}

export default App

