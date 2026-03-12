import { useState } from 'react'
import './App.css'
import beeFactsData from './beefacts.json'
import BeeSVG from './buttonbee'

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
        <h3>Bee inquisitive! Click the bee for a fun fact about our pollinating friends.</h3>
        <div onClick={getRandomBeeFact} style={{ cursor: 'pointer' }}>
          <BeeSVG />
        </div>
        <p>{fact}</p>
        <small>All bee facts were sourced from bestbees.com. Thank you!</small>
      </div>
    </>
  )
}

export default App

