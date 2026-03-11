import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      </div>
      <h1>Random Bee Facts</h1>
      <div className="card">
        <button>
          Get a random bee fact!
        </button>
      </div>
    </>
  )
}

export default App
