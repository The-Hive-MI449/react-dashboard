import './App.css'
import { HoneyProducts } from "/workspaces/react-dashboard/honeyAPI/src/components/HoneyProducts";
import Facts from "../randomfactAPI/src/App"
import Weather from "../weatherAPI/src/App"
import { useState } from 'react';
import BeeSVG from "../weatherAPI/buttonbee"

function App() {
  const [showHoneyProducts, setShowHoneyProducts] = useState(false);
  const [showFacts, setShowFacts] = useState(false);
  const [showWeather, setShowWeather] = useState(false);

  return (
    <div className="appContainer">
      <img src="/hiveLogo.png" alt="Hive Logo" className="logo" />
      <h1 className='header'>The Hive</h1>
      <h2 className='subheader'>Bee React Dashboard</h2>
      <h3 className='cta'>Click a bee below to explore the dashboard!</h3>
      <section className='apiSection'>
        <div className='apiCard'>
          <h3 className='apiCardHeader'>Honey API</h3>
          <button className='apiCardButton' onClick={() => {setShowHoneyProducts(!showHoneyProducts)}}>
            <BeeSVG/>
          </button>
          {showHoneyProducts && 
            <div className='apiCardBody'>
              <HoneyProducts/>
            </div>
          }
        </div>
        <div className='apiCard'>
          <h3 className='apiCardHeader'>Bee Facts API</h3>
          <button className='apiCardButton' onClick={() => {setShowFacts(!showFacts)}}>
            <BeeSVG/>
          </button>
          {showFacts && 
            <div className='apiCardBody'>
              <Facts/>
            </div>
          }
        </div>
        <div className='apiCard'>
          <h3 className='apiCardHeader'>Weather API</h3>
          <button className='apiCardButton' onClick={() => {setShowWeather(!showWeather)}}>
            <BeeSVG/>
          </button>
          {showWeather && 
            <div className='apiCardBody'>
              <Weather/>
            </div>
          }
        </div>
      </section>
    </div>
  )
}

export default App
