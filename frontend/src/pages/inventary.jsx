import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminPanel from "./AdminPanel";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const serverUrl = "http://localhost:3001";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${serverUrl}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.productId.toLowerCase().includes(search.toLowerCase())
  );

  const handleImageError = (e) => {
    e.target.onerror = null; // To avoid infinite loop
    e.target.src = `${serverUrl}/images/default.png`; // Set default image properly
  };

  return (
    <AdminPanel>
      <div className="container mt-5">
        <div className="text-center mb-4">
          <h1 className="fw-bold text-primary">Product Inventory</h1>
        </div>

        <div className="d-flex justify-content-center mb-3">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control w-50 shadow-sm"
          />
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="table-responsive shadow-sm">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Image</th>
                  <th>Product ID</th>
                  <th>HSN Code</th>
                  <th>GST %</th>
                  <th>Sizes</th>
                  <th>Prices</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={product.productId} className={index % 2 === 0 ? "table-light" : "table-white"}>
                    <td>
                      <img
                        src={`http://localhost:3001/images/${product.image}`}
                        alt={product.productId}
                        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "10px" }}
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = "http://localhost:3001/images/default.png"; 
                        }}
                      />
                    </td>

                    <td className="fw-bold text-primary">{product.productId}</td>
                    <td>{product.hsnCode}</td>
                    <td>{product.gst}%</td>
                    <td>
                      <ul className="list-unstyled">
                        {product.sizes.map((size, idx) => (
                          <li key={idx}>{size.size}</li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <ul className="list-unstyled fw-bold">
                        {product.sizes.map((size, idx) => (
                          <li key={idx}>₹{size.rate}</li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <ul className="list-unstyled">
                        {product.sizes.map((size, idx) => (
                          <li key={idx} className={size.quantity > 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
                            {size.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-danger fw-bold">No products found.</p>
        )}
      </div>
    </AdminPanel>
  );
};

export default ProductList;
