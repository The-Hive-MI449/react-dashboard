import { useState, useEffect } from 'react'
import './WeatherWidget.css'

interface WeatherData {
  temperature: number
  windspeed: number
  weathercode: number
  time: string
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null)
  const [city, setCity] = useState<string>('')

  useEffect(() => {
    getUserLocation()
  }, [])

  useEffect(() => {
    if (location) {
      fetchWeather()
    }
  }, [location, fetchWeather])

  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          setError('Unable to get your location. Please allow location access.')
        }
      )
    } else {
      setError('Geolocation is not supported by this browser.')
    }
  }

  async function fetchWeather() {
    if (!location) return

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true&timezone=auto`
      )

      if (!response.ok) throw new Error('Failed to fetch weather data')

      const data = await response.json()
      setWeather(data.current_weather)

      // Try to get city name (optional)
      try {
        const cityResponse = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location.lat}&longitude=${location.lon}&localityLanguage=en`
        )
        if (cityResponse.ok) {
          const cityData = await cityResponse.json()
          setCity(cityData.city || cityData.locality || 'Your Location')
        }
      } catch {
        console.log('Could not fetch city name')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  function getWeatherIcon(code: number) {
    // WMO Weather interpretation codes
    if (code === 0) return '☀️' // Clear sky
    if (code >= 1 && code <= 3) return '⛅' // Partly cloudy
    if (code >= 45 && code <= 48) return '🌫️' // Fog
    if (code >= 51 && code <= 55) return '🌦️' // Drizzle
    if (code >= 56 && code <= 57) return '🧊' // Freezing drizzle
    if (code >= 61 && code <= 65) return '🌧️' // Rain
    if (code >= 66 && code <= 67) return '🧊' // Freezing rain
    if (code >= 71 && code <= 75) return '❄️' // Snow
    if (code >= 77) return '🌨️' // Snow grains
    if (code >= 80 && code <= 82) return '🌦️' // Rain showers
    if (code >= 85 && code <= 86) return '🌨️' // Snow showers
    if (code >= 95) return '⛈️' // Thunderstorm
    return '🌤️' // Default
  }

  function getBeeForagingAdvice(temp: number, wind: number) {
    const tooCold = temp < 55 // 55°F is about 13°C
    const tooWindy = wind > 15 // 15 mph is about 24 km/h

    if (tooCold && tooWindy) {
      return {
        status: 'Poor',
        message: 'Too cold and windy for bees to forage safely.',
        color: '#e63e11'
      }
    } else if (tooCold) {
      return {
        status: 'Poor',
        message: 'Too cold for bees to forage.',
        color: '#ee8100'
      }
    } else if (tooWindy) {
      return {
        status: 'Fair',
        message: 'Windy conditions may affect bee foraging.',
        color: '#fecb02'
      }
    } else {
      return {
        status: 'Good',
        message: 'Perfect weather for bees to forage!',
        color: '#038141'
      }
    }
  }

  const advice = weather ? getBeeForagingAdvice(weather.temperature, weather.windspeed) : null

  return (
    <div className="weather-widget">
      <h2>🌤️ Local Weather</h2>
      <p className="subtitle">Check conditions for bee foraging</p>

      {!location && !error && (
        <div className="location-prompt">
          <p>📍 Allow location access to see local weather</p>
          <button onClick={getUserLocation} className="location-btn">
            Get My Location
          </button>
        </div>
      )}

      <button onClick={fetchWeather} disabled={loading || !location} className="refresh-weather-btn">
        {loading ? 'Loading...' : '🔄 Refresh Weather'}
      </button>

      {error && <p className="error-message">{error}</p>}

      {weather && (
        <div className="weather-card">
          <div className="weather-header">
            <div className="weather-icon">
              {getWeatherIcon(weather.weathercode)}
            </div>
            <div className="location-info">
              <h3>{city || 'Your Location'}</h3>
              <p className="weather-time">{new Date(weather.time).toLocaleTimeString()}</p>
            </div>
          </div>

          <div className="weather-stats">
            <div className="stat">
              <span className="stat-label">Temperature</span>
              <span className="stat-value">{Math.round(weather.temperature)}°F</span>
            </div>
            <div className="stat">
              <span className="stat-label">Wind Speed</span>
              <span className="stat-value">{Math.round(weather.windspeed)} mph</span>
            </div>
          </div>

          {advice && (
            <div className="foraging-advice" style={{ borderLeftColor: advice.color }}>
              <h4>Bee Foraging: <span style={{ color: advice.color }}>{advice.status}</span></h4>
              <p>{advice.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}