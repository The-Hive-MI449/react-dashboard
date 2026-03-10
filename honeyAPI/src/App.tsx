import './App.css'
import { HoneyProducts } from './components/HoneyProducts'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="bee-emoji">🐝</span>
            <h1>Honey Hub</h1>
          </div>
          <p className="tagline">Discover honey products crafted with care</p>
        </div>
      </header>

      <main className="app-main">
        <div className="dashboard-grid">
          <HoneyProducts />
        </div>
      </main>

      <footer className="app-footer">
        <p>🌍 Powered by OpenFoodFacts API</p>
      </footer>
    </div>
  )
}

export default App