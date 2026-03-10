import { useState, useEffect } from 'react'
import './BeeFacts.css'

interface BeeFact {
  fact: string
  category: string
}

export function BeeFacts() {
  const [facts, setFacts] = useState<BeeFact[]>([])
  const [currentFact, setCurrentFact] = useState<BeeFact | null>(null)
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [showFavorites, setShowFavorites] = useState(false)

  useEffect(() => {
    loadBeeFacts()
  }, [])

  function loadBeeFacts() {
    // Bee facts stored locally (could be from an API or localStorage)
    const beeFactsData: BeeFact[] = [
      { fact: "Honey bees communicate with each other through the 'waggle dance' which tells other bees the location of flowers.", category: "Communication" },
      { fact: "A single bee colony can contain up to 60,000 bees working together.", category: "Colony" },
      { fact: "Bees visit about 50-100 flowers during a single collecting trip.", category: "Foraging" },
      { fact: "One pound of honey requires about 2 pounds of honey bees to gather the nectar.", category: "Production" },
      { fact: "A bee's wings beat approximately 200 times per second.", category: "Anatomy" },
      { fact: "Honey bees can fly at speeds up to 20 mph.", category: "Flight" },
      { fact: "The average worker bee lives about 6 weeks during busy seasons.", category: "Lifespan" },
      { fact: "A queen bee can lay up to 2,000 eggs per day.", category: "Reproduction" },
      { fact: "Bees have five eyes - three simple eyes on top and two large compound eyes in front.", category: "Anatomy" },
      { fact: "Honey never spoils and can be preserved indefinitely.", category: "Honey" },
      { fact: "Bees are responsible for pollinating about 1/3 of the food we eat.", category: "Pollination" },
      { fact: "A bee must visit about 2 million flowers to make 1 pound of honey.", category: "Production" },
      { fact: "Bees see ultraviolet light that humans cannot see.", category: "Vision" },
      { fact: "The temperature inside a beehive is regulated at about 95°F or 35°C.", category: "Hive" },
      { fact: "Bees perform a 'funeral service' by carrying dead bees out of the hive.", category: "Behavior" },
      { fact: "Honey contains all the vitamins and minerals needed to sustain human life.", category: "Nutrition" },
      { fact: "A worker bee produces about 1/12th of a teaspoon of honey in her lifetime.", category: "Production" },
      { fact: "Bees have been around for over 130 million years.", category: "History" },
      { fact: "Queen bees lay about 1.5 million eggs in their lifetime.", category: "Reproduction" },
      { fact: "The hexagon shape of honeycomb is the most efficient structure in nature.", category: "Architecture" },
      { fact: "Bees can recognize human faces.", category: "Intelligence" },
      { fact: "Propolis, made by bees, has antibacterial and antifungal properties.", category: "Medicine" },
      { fact: "A bee's memory is remarkable - they can remember colors, shapes, and scents.", category: "Memory" },
      { fact: "Bees navigate using the sun as a compass.", category: "Navigation" },
      { fact: "The honey bee is the state insect of 17 U.S. states.", category: "Culture" }
    ]

    setFacts(beeFactsData)

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('beeFactsFavorites')
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)))
    }

    // Show random fact
    const randomIndex = Math.floor(Math.random() * beeFactsData.length)
    setCurrentFact(beeFactsData[randomIndex])
    setLoading(false)
  }

  function getRandomFact() {
    if (facts.length === 0) return

    const availableFacts = showFavorites
      ? facts.filter((_, index) => favorites.has(index))
      : facts

    if (availableFacts.length === 0) {
      setCurrentFact(null)
      return
    }

    const randomIndex = Math.floor(Math.random() * availableFacts.length)
    const factIndex = showFavorites
      ? facts.indexOf(availableFacts[randomIndex])
      : randomIndex

    setCurrentFact(facts[factIndex])
  }

  function toggleFavorite() {
    if (!currentFact) return

    const factIndex = facts.indexOf(currentFact)
    const newFavorites = new Set(favorites)

    if (favorites.has(factIndex)) {
      newFavorites.delete(factIndex)
    } else {
      newFavorites.add(factIndex)
    }

    setFavorites(newFavorites)
    localStorage.setItem('beeFactsFavorites', JSON.stringify([...newFavorites]))
  }

  function toggleShowFavorites() {
    setShowFavorites(!showFavorites)
    getRandomFact()
  }

  const currentFactIndex = currentFact ? facts.indexOf(currentFact) : -1
  const isFavorite = currentFactIndex !== -1 && favorites.has(currentFactIndex)

  return (
    <div className="bee-facts">
      <h2>🐝 Bee Facts</h2>
      <p className="subtitle">Learn fascinating facts about our amazing pollinators</p>

      <div className="controls">
        <button onClick={getRandomFact} className="random-btn" disabled={loading}>
          {loading ? 'Loading...' : '🎲 Random Fact'}
        </button>

        <button onClick={toggleShowFavorites} className="favorites-toggle">
          {showFavorites ? '📚 All Facts' : '⭐ Favorites Only'}
        </button>
      </div>

      {currentFact && (
        <div className="fact-card">
          <div className="fact-header">
            <span className="category">{currentFact.category}</span>
            <button
              onClick={toggleFavorite}
              className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? '⭐' : '☆'}
            </button>
          </div>

          <p className="fact-text">{currentFact.fact}</p>

          <div className="fact-stats">
            <span>Favorites: {favorites.size}</span>
            <span>Total Facts: {facts.length}</span>
          </div>
        </div>
      )}

      {!currentFact && !loading && (
        <div className="no-facts">
          <p>{showFavorites ? 'No favorite facts yet! Click the star to add some.' : 'No facts available.'}</p>
        </div>
      )}
    </div>
  )
}