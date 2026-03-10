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
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryTag, setCategoryTag] = useState('en:honey')
  const [pageSize, setPageSize] = useState(50)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

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
      setFilteredProducts(validProducts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching honey products')
    } finally {
      setLoading(false)
    }
  }, [categoryTag, pageSize])

  useEffect(() => {
    fetchHoneyProducts()
  }, [fetchHoneyProducts])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(product =>
        product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brands?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProducts(filtered)
    }
  }, [products, searchTerm])


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
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

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
          {loading ? 'Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="products-grid">
        {filteredProducts.map((product, index) => (
          <div key={index} className="product-card">
            {product.image_url && (
              <div className="product-image">
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  loading="lazy"
                />
              </div>
            )}

            <div className="product-info">
              <h3>{product.product_name}</h3>
              {product.brands && <p className="brand">by {product.brands}</p>}

              <div className="scores">
                {product.nutriscore_grade && (
                  <div className="score">
                    <span className="score-label">Nutrition:</span>
                    <span
                      className="score-value"
                      style={{ backgroundColor: getNutriScoreColor(product.nutriscore_grade) }}
                    >
                      {product.nutriscore_grade.toUpperCase()}
                    </span>
                  </div>
                )}

                {product.ecoscore_grade && (
                  <div className="score">
                    <span className="score-label">Eco:</span>
                    <span
                      className="score-value"
                      style={{ backgroundColor: getEcoScoreColor(product.ecoscore_grade) }}
                    >
                      {product.ecoscore_grade.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {product.url && (
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-details-btn"
                >
                  View Details →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && !error && (
        <p className="no-results">No honey products found matching your search.</p>
      )}
    </div>
  )
}