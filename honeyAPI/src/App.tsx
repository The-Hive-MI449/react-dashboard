import './App.css'
import { HoneyFoods } from './components/HoneyFoods'
import { RandomFacts } from './components/RandomFacts'

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🍯 Bee & Honey Hub</h1>
          <p className="app-subtitle">Discover honey products, learn about bees, and explore nature's golden treasure</p>
        </div>
      </header>

      <main className="app-main">
        <div className="app-container">
          <HoneyFoods />
          <RandomFacts />
        </div>
      </main>

      <footer className="app-footer">
        <p>🌍 Data sources: OpenFoodFacts API | Local Bee Facts Database</p>
      </footer>
    </div>
  )
}

export default App
