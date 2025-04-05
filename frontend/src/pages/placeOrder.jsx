import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminPanel from "./AdminPanel";

const PlaceOrder = () => {
  const [quotations, setQuotations] = useState([]);
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState({
    customerName: "",
    address: "",
    phone: "",
    gst: "",
    items: [],
    totalAmount: 0,
  });
  const [selectedQuotation, setSelectedQuotation] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quotationsRes, productsRes] = await Promise.all([
          axios.get("http://localhost:3001/quotations"),
          axios.get("http://localhost:3001/products"),
        ]);
        setQuotations(quotationsRes.data || []);
        setProducts(productsRes.data || []);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const handleQuotationSelect = (quotationId) => {
    const quotation = quotations.find((q) => q.quotationId === quotationId);
    if (quotation) {
      setOrder({
        ...order,
        customerName: quotation.customerName,
        address: quotation.address,
        phone: quotation.phone,
        items: quotation.items.map((item) => ({ ...item })),
        totalAmount: quotation.totalAmount,
      });
      setSelectedQuotation(quotationId);
    }
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    const product = products.find((p) => p.productId === productId);
    if (product && !order.items.some((item) => item.productId === productId)) {
      setOrder({
        ...order,
        items: [...order.items, { ...product, quantity: 1, cost: product.price }],
      });
    }
    setSelectedProduct("");
  };

  const handleQuantityChange = (index, e) => {
    const newItems = [...order.items];
    newItems[index].quantity = parseInt(e.target.value) || 1;
    newItems[index].cost = newItems[index].quantity * newItems[index].price;
    setOrder({ ...order, items: newItems });
  };

  const removeItem = (index) => {
    const newItems = order.items.filter((_, i) => i !== index);
    setOrder({ ...order, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/quotation/orders", order);
      alert("Order placed successfully!");
      setOrder({ customerName: "", address: "", phone: "", gst: "", items: [], totalAmount: 0 });
    } catch (error) {
      console.error("Error placing order", error);
    }
  };

  return (
    <AdminPanel>
      <div className="container mt-4">
        <h2>Place Order</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Select Quotation (Optional)</label>
            <select className="form-select" onChange={(e) => handleQuotationSelect(e.target.value)}>
              <option value="">Select a Quotation</option>
              {quotations.map((q) => (
                <option key={q.quotationId} value={q.quotationId}>{q.quotationId}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>GST</label>
            <input className="form-control" value={order.gst} onChange={(e) => setOrder({ ...order, gst: e.target.value })} />
          </div>

          <div className="mb-3">
            <label>Search Product</label>
            <input className="form-control" value={productSearch} onChange={(e) => setProductSearch(e.target.value)} />
            <select className="form-select" onChange={handleProductChange} value={selectedProduct}>
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.productId} value={p.productId}>{p.productName}</option>
              ))}
            </select>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Cost</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productName}</td>
                    <td>
                      <input className="form-control" type="number" min="1" value={item.quantity} onChange={(e) => handleQuantityChange(index, e)} />
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${item.cost.toFixed(2)}</td>
                    <td>
                      <button type="button" className="btn btn-danger" onClick={() => removeItem(index)}>×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3>Total: ${order.items.reduce((sum, item) => sum + item.cost, 0).toFixed(2)}</h3>
          <button type="submit" className="btn btn-primary">Place Order</button>
        </form>
      </div>
    </AdminPanel>
  );
};

export default PlaceOrder;
