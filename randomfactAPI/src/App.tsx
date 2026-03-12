import { useState } from 'react'
import './App.css'
import beeFactsData from './beefacts.json'

function App() {
  const [fact, setFact] = useState("")

  const getRandomBeeFact = () => {
    const facts = beeFactsData.beeFacts
    const randomIndex = Math.floor(Math.random() * facts.length)
    setFact(facts[randomIndex])
  }

  return (
    <>
      <div></div>
      <h1>Random Bee Fact!</h1>
      <div className="card">
        <button onClick={getRandomBeeFact}>Get a random bee fact!</button>
        <p>{fact}</p>
        <small>All bee facts were sourced from bestbees.com. Thank you!</small>
      </div>
    </>
  )
}

export default App

