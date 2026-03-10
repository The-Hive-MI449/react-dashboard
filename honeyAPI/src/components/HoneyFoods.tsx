import { useState } from 'react'
import '../styles/HoneyFoods.css'

type HoneyProduct = {
  product_name?: string
  brands?: string
  nutrition_grades?: string
  image_url?: string
  url?: string
}

export function HoneyFoods() {
  const [product, setProduct] = useState<HoneyProduct | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchRandomHoney() {
    setLoading(true)
    setError(null)
    try {
      // Fetch honey products from OpenFoodFacts
      const response = await fetch(
        'https://world.openfoodfacts.org/cgi/search.pl?search_terms=honey&search_simple=1&action=process&json=1'
      )
      if (!response.ok) throw new Error('Failed to fetch honey products')
      
      const data = await response.json()
      const products = data.products || []
      
      if (products.length === 0) {
        setError('No honey products found')
        return
      }

      // Select a random product
      const randomIndex = Math.floor(Math.random() * products.length)
      const randomProduct = products[randomIndex]
      
      setProduct({
        product_name: randomProduct.product_name || 'Unknown Product',
        brands: randomProduct.brands || 'Unknown Brand',
        nutrition_grades: randomProduct.nutrition_grades || 'N/A',
        image_url: randomProduct.image_url || '',
        url: randomProduct.url || '',
      })
    } catch (err: any) {
      setError(err?.message ?? 'An error occurred while fetching honey products')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="honey-foods-container">
      <h2>🍯 Random Honey Product</h2>
      <p className="subtitle">Discover delicious honey-based foods</p>
      
      <button className="get-honey-btn" onClick={fetchRandomHoney} disabled={loading}>
        {loading ? 'Finding honey...' : 'Get Random Honey Product'}
      </button>

      {error && <p className="error-message">{error}</p>}

      {product && (
        <div className="product-card">
          {product.image_url && (
            <div className="product-image-container">
              <img 
                src={product.image_url} 
                alt={product.product_name}
                className="product-image"
              />
            </div>
          )}
          
          <div className="product-info">
            <h3>{product.product_name}</h3>
            <p><strong>Brand:</strong> {product.brands}</p>
            <p><strong>Nutrition Grade:</strong> {product.nutrition_grades}</p>
            
            {product.url && (
              <a 
                href={product.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="view-details-link"
              >
                View on OpenFoodFacts →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
