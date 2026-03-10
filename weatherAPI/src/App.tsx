import { useState } from 'react'
import './App.css'

type Weather = {
  temperature: number
  windspeed: number
  time?: string
  city?: string
}

function App() {
  const [zip, setZip] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [weather, setWeather] = useState<Weather | null>(null)

  async function handleFetch(e?: React.FormEvent) {
    if (e) e.preventDefault()
    setError(null)
    setWeather(null)

    const zipTrim = zip.trim()
    if (!/^\d{5}$/.test(zipTrim)) {
      setError('Please enter a valid 5-digit US zipcode.')
      return
    }

    setLoading(true)
    try {
      // Get lat/lon from Zippopotam.us
      const geoRes = await fetch(`https://api.zippopotam.us/us/${zipTrim}`)
      if (!geoRes.ok) throw new Error('Zipcode not found')
      const geo = await geoRes.json()
      const place = geo.places && geo.places[0]
      if (!place) throw new Error('Location data unavailable')
      const latitude = parseFloat(place.latitude)
      const longitude = parseFloat(place.longitude)
      const cityName = place['place name'] || place['place_name'] || place.place_name || place.name || ''

      // Fetch current weather from Open-Meteo (request Fahrenheit and mph when available)
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto&temperature_unit=fahrenheit&windspeed_unit=mph`
      )
      if (!weatherRes.ok) throw new Error('Weather fetch failed')
      const weatherJson = await weatherRes.json()
      const current = weatherJson.current_weather
      if (!current) throw new Error('No current weather available')

      setWeather({
        temperature: current.temperature,
        windspeed: current.windspeed,
        time: current.time,
        city: cityName,
      })
    } catch (err: any) {
      setError(err?.message ?? 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Advisory message for bees based on temperature (°F) and wind (mph)
  let advisory = ''
  if (weather) {
    const city = weather.city || 'your area'
    const tooCold = weather.temperature < 55
    const tooWindy = weather.windspeed > 15
    if (tooCold && tooWindy) {
      advisory = `Right now in ${city} it is too cold for the bees to forage. Right now in ${city} it is too windy for the bees to forage.`
    } else if (tooCold) {
      advisory = `Right now in ${city} it is too cold for the bees to forage.`
    } else if (tooWindy) {
      advisory = `Right now in ${city} it is too windy for the bees to forage.`
    } else {
      advisory = `Right now in ${city} the weather is just how the bees like it - warm and calm.`
    }
  }

  return (
    <div className="App" style={{padding:20,maxWidth:600,margin:'0 auto'}}>
      <h1>Weather by Zipcode</h1>
      <form onSubmit={handleFetch} style={{display:'flex',gap:8,alignItems:'center'}}>
        <input
          aria-label="zipcode"
          placeholder="Enter 5-digit US zipcode"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
        />
        <button className="lookup-btn" type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Lookup'}
        </button>
      </form>

      {error && <p style={{color:'red'}}>{error}</p>}

      {weather && (
        <div style={{marginTop:16}}>
          <p><strong>Temperature:</strong> {weather.temperature} °F</p>
          <p><strong>Wind Speed:</strong> {weather.windspeed} mph</p>
          {/* {weather.time && <p><strong>Time:</strong> {weather.time}</p>} */}
          <p style={{marginTop:12,fontWeight:500}}>{advisory}</p>
        </div>
      )}

      <p style={{marginTop:20,fontSize:12,color:'#666'}}>
        Uses Zippopotam.us for geocoding and Open-Meteo for current weather.
      </p>
    </div>
  )
}

export default App
