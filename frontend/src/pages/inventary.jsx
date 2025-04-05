import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.productId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Product List</h1>
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by Product Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
      </div>
      
      {filteredProducts.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 border-collapse border border-gray-300">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">Product ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">HSN Code</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">GST %</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">Sizes</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">Prices</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">Stock</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product, index) => (
                <tr key={product.productId} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 border border-gray-300">{product.productId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">{product.hsnCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border border-gray-300">{product.gst}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border border-gray-300">
                    <ul className="space-y-1">
                      {product.sizes.map((size, index) => (
                        <li key={index}>{size.size}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border border-gray-300">
                    <ul className="space-y-1">
                      {product.sizes.map((size, index) => (
                        <li key={index} className="font-semibold">₹{size.rate}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border border-gray-300">
                    <ul className="space-y-1">
                      {product.sizes.map((size, index) => (
                        <li key={index} className={size.quantity > 0 ? "text-green-600" : "text-red-500"}>{size.quantity}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg py-10">No products found.</p>
      )}
    </div>
  );
};

export default ProductList;

