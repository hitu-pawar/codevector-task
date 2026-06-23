import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [cursor, setCursor] = useState(null);

  const fetchProducts = async (reset = false) => {
    let url = "http://localhost:5000/products?limit=20";

    if (category) {
      url += `&category=${category}`;
    }

    if (cursor && !reset) {
      url += `&cursor=${cursor}`;
    }

    const res = await axios.get(url);

    if (reset) {
      setProducts(res.data.products);
    } else {
      setProducts((prev) => [...prev, ...res.data.products]);
    }

    setCursor(res.data.nextCursor);
  };

  useEffect(() => {
    setCursor(null);
    fetchProducts(true);
  }, [category]);

  return (
    <div className="container">
      <h1>CodeVector Product Browser</h1>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Fashion">Fashion</option>
        <option value="Books">Books</option>
        <option value="Furniture">Furniture</option>
        <option value="Sports">Sports</option>
      </select>

      <div className="grid">
        {products.map((p) => (
          <div className="card" key={p.id}>
            <h3>{p.name}</h3>
            <p>{p.category}</p>
            <strong>₹{p.price}</strong>
          </div>
        ))}
      </div>

      {cursor && (
        <button onClick={() => fetchProducts()}>
          Load More
        </button>
      )}
    </div>
  );
}

export default App;