import { useState, useEffect } from 'react'
import '../styles/RandomFacts.css'

export function RandomFacts() {
  const [fact, setFact] = useState<string | null>(null)
  const [facts, setFacts] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load bee facts from the JSON file
    async function loadFacts() {
      try {
        const response = await fetch('/beeFacts.json')
        if (!response.ok) throw new Error('Failed to load facts')
        const data = await response.json()
        setFacts(data.facts || [])
        if (data.facts && data.facts.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.facts.length)
          setFact(data.facts[randomIndex])
        }
      } catch (error) {
        console.error('Error loading facts:', error)
        setFact('Could not load bee facts')
      } finally {
        setLoading(false)
      }
    }

    loadFacts()
  }, [])

  function getNewFact() {
    if (facts.length === 0) return
    const randomIndex = Math.floor(Math.random() * facts.length)
    setFact(facts[randomIndex])
  }

  return (
    <div className="random-facts-container">
      <h2>🐝 Random Bee Fact</h2>
      <p className="subtitle">Learn something new about our buzzy friends</p>
      
      <button 
        className="new-fact-btn" 
        onClick={getNewFact}
        disabled={loading || facts.length === 0}
      >
        {loading ? 'Loading facts...' : 'Get New Fact'}
      </button>

      {fact && (
        <div className="fact-card">
          <p className="fact-text">{fact}</p>
        </div>
      )}
    </div>
  )
}
