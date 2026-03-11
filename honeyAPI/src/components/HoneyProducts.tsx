import { useState, useEffect, useCallback } from 'react'
import './HoneyProducts.css'

interface Product {
  product_name?: string
  brands?: string
  categories?: string
  image_url?: string
  nutriscore_grade?: string
  nova_group?: number
  ecoscore_grade?: string
  url?: string
}

export function HoneyProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categoryTag, setCategoryTag] = useState('en:honey')
  const [pageSize, setPageSize] = useState(50)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)

  const fetchHoneyProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // construct query parameters, allowing empty categoryTag
      const params = new URLSearchParams()
      if (categoryTag.trim() !== '') {
        params.set('categories_tags', categoryTag)
      }
      params.set('page_size', pageSize.toString())

      const url = `https://world.openfoodfacts.org/api/v2/search?${params.toString()}`
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch products')

      const data = await response.json()
      const productsData = data.products || []

      // Filter out products without names
      const validProducts = productsData.filter((product: Product) => product.product_name)

      setProducts(validProducts)
      // Set a random product as the initial display
      if (validProducts.length > 0) {
        const randomIndex = Math.floor(Math.random() * validProducts.length)
        setCurrentProduct(validProducts[randomIndex])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching honey products')
    } finally {
      setLoading(false)
    }
  }, [categoryTag, pageSize])

  useEffect(() => {
    fetchHoneyProducts()
  }, [fetchHoneyProducts])

  const getRandomProduct = () => {
    if (products.length === 0) return
    const randomIndex = Math.floor(Math.random() * products.length)
    setCurrentProduct(products[randomIndex])
  }


  function getNutriScoreColor(grade?: string) {
    switch (grade?.toLowerCase()) {
      case 'a': return '#038141'
      case 'b': return '#85bb2f'
      case 'c': return '#fecb02'
      case 'd': return '#ee8100'
      case 'e': return '#e63e11'
      default: return '#666'
    }
  }

  function getEcoScoreColor(grade?: string) {
    switch (grade?.toLowerCase()) {
      case 'a': return '#038141'
      case 'b': return '#85bb2f'
      case 'c': return '#fecb02'
      case 'd': return '#ee8100'
      case 'e': return '#e63e11'
      default: return '#666'
    }
  }

  return (
    <div className="honey-products">
      <h2>🍯 {categoryTag.trim() === '' ? 'Products' : categoryTag.replace(/^\w+:/, '') + ' Products'}</h2>
      <p className="subtitle">
        {categoryTag.trim() === ''
          ? 'Explore a variety of products from OpenFoodFacts'
          : `Explore items tagged with "${categoryTag}"`}
      </p>

      <div className="search-container">
        <input
          type="text"
          placeholder="Category tag (e.g. en:honey or en:tea)"
          value={categoryTag}
          onChange={(e) => setCategoryTag(e.target.value)}
          className="search-input"
        />

        <input
          type="number"
          min={1}
          max={100}
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="search-input"
          style={{ width: '6rem' }}
          title="Number of products to fetch"
        />

        <button onClick={fetchHoneyProducts} disabled={loading} className="refresh-btn">
          {loading ? 'Loading...' : '🔄 Load Products'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="random-product-section">
        <button 
          onClick={getRandomProduct} 
          disabled={products.length === 0 || loading}
          className="random-btn"
        >
          🎲 Show Random Honey Product
        </button>
      </div>

      {currentProduct && (
        <div className="single-product-container">
          <div className="product-card">
            {currentProduct.image_url && (
              <div className="product-image">
                <img
                  src={currentProduct.image_url}
                  alt={currentProduct.product_name}
                  loading="lazy"
                />
              </div>
            )}

            <div className="product-info">
              <h3>{currentProduct.product_name}</h3>
              {currentProduct.brands && <p className="brand">by {currentProduct.brands}</p>}

              <div className="scores">
                {currentProduct.nutriscore_grade && (
                  <div className="score">
                    <span className="score-label">Nutrition:</span>
                    <span
                      className="score-value"
                      style={{ backgroundColor: getNutriScoreColor(currentProduct.nutriscore_grade) }}
                    >
                      {currentProduct.nutriscore_grade.toUpperCase()}
                    </span>
                  </div>
                )}

                {currentProduct.ecoscore_grade && (
                  <div className="score">
                    <span className="score-label">Eco:</span>
                    <span
                      className="score-value"
                      style={{ backgroundColor: getEcoScoreColor(currentProduct.ecoscore_grade) }}
                    >
                      {currentProduct.ecoscore_grade.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {currentProduct.url && (
                <a
                  href={currentProduct.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-details-btn"
                >
                  View Details →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}