import React, { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://world.openfoodfacts.org/api/v2/search?categories_tags=en:honey")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
      })
      .catch((error) => console.error(error));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.product_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Honey Product Dashboard</h1>

      <input
        type="text"
        placeholder="Search honey products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table border="1" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Brand</th>
            <th>Country</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.slice(0, 20).map((product, index) => (
            <tr key={index}>
              <td>{product.product_name}</td>
              <td>{product.brands}</td>
              <td>{product.countries}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;