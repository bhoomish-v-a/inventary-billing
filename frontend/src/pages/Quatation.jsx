import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminPanel from "./AdminPanel";

const QuotationForm = () => {
 
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manualCustomer, setManualCustomer] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [showAllCustomers, setShowAllCustomers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  
  const [quotation, setQuotation] = useState({
    customerName: "",
    address: "",
    phone: "",
    date: new Date().toISOString().split("T")[0],
    items: [],
    grandTotal: 0,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customersRes, productsRes] = await Promise.all([
          axios.get("http://localhost:3001/customers"),
          axios.get("http://localhost:3001/products")
        ]);
        setCustomers(customersRes.data || []);
        setProducts(productsRes.data || []);
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Safely filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      (c?.customerName?.toLowerCase() || '').includes((customerSearch?.toLowerCase() || ''))
    );
  }, [customers, customerSearch]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      (p?.productName?.toLowerCase() || '').includes((productSearch?.toLowerCase() || ''))
    );
  }, [products, productSearch]);

  // Customer handlers
  const handleCustomerSelect = (customer) => {
    if (!customer) return;
    
    setQuotation({ 
      ...quotation, 
      customerName: customer.customerName || "", 
      address: customer.address || "", 
      phone: customer.phone || "" 
    });
    setCustomerSearch(customer.customerName || "");
    setManualCustomer(false);
    setShowAllCustomers(false);
  };

  // Handle Product Selection
  const handleProductSelect = (e) => {
    const productId = e.target.value;
    if (!productId) return;
  
    const product = products.find((p) => p.productId === productId);
    
    if (product && !quotation.items.some((item) => item.productId === productId)) {
      setQuotation({
        ...quotation,
        items: [
          ...quotation.items,
          {
            productId: product.productId || "",
            productName: product.productName || "",
            size: "",
            quantity: 1,
            price: 0,
            cost: 0,
            sizes: product.sizes || [],
          },
        ],
      });
    }
    setSelectedProduct("");
  };
  const handleManualCustomer = () => {
    setQuotation({ 
      ...quotation, 
      customerName: "", 
      address: "", 
      phone: "" 
    });
    setCustomerSearch("");
    setManualCustomer(true);
    setShowAllCustomers(false);
  };

  // Product handlers
  const handleProductChange = (e) => {
    const productId = e.target.value;
    if (!productId) return;
    
    const product = products.find((p) => p.productId === productId);
    
    if (product && !quotation.items.some(item => item.productId === productId)) {
      setQuotation({
        ...quotation,
        items: [
          ...quotation.items, 
          { 
            productId: product.productId || "", 
            productName: product.productName || "", 
            size: "", 
            quantity: 1, 
            price: 0, 
            cost: 0, 
            sizes: product.sizes || [] 
          }
        ],
      });
    }
    setSelectedProduct("");
  };

  const handleSizeChange = (index, e) => {
    if (index < 0 || index >= quotation.items.length) return;
    
    const newItems = [...quotation.items];
    const selectedSize = newItems[index]?.sizes?.find((s) => s.size === e.target.value);
    
    if (selectedSize) {
      newItems[index] = {
        ...newItems[index],
        size: selectedSize.size || "",
        price: selectedSize.rate || 0,
        cost: (selectedSize.rate || 0) * (newItems[index].quantity || 1)
      };
    }
    setQuotation({ ...quotation, items: newItems });
  };

  const handleQuantityChange = (index, e) => {
    if (index < 0 || index >= quotation.items.length) return;
    
    const newItems = [...quotation.items];
    const quantity = parseInt(e.target.value) || 1;
    newItems[index] = {
      ...newItems[index],
      quantity,
      cost: quantity * (newItems[index].price || 0)
    };
    setQuotation({ ...quotation, items: newItems });
  };

  const removeItem = (index) => {
    if (index < 0 || index >= quotation.items.length) return;
    
    const newItems = [...quotation.items];
    newItems.splice(index, 1);
    setQuotation({...quotation, items: newItems});
  };

  // Calculations
  const calculateGrandTotal = () => {
    return quotation.items.reduce((sum, item) => sum + (item.cost || 0), 0);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form
    if (!quotation.customerName) {
      setError("Please select or enter a customer");
      return;
    }
  
    if (quotation.items.length === 0) {
      setError("Please add at least one product");
      return;
    }
  
    try {
      setLoading(true);
  
      // Prepare the request data
      const requestData = {
        customerId: quotation.customerId,
        customerName: quotation.customerName,
        address: quotation.address,
        phone: quotation.phone,
        date: quotation.date,
        items: quotation.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          cost: item.cost,
        })),
        grandTotal: calculateGrandTotal(),
      };
  
      // Make the API request and wait for response
      const response = await axios.post("http://localhost:3001/quotations/create-pdf", requestData);
  
      if (response.status === 200) {
        // Open the generated PDF
        window.open(`http://localhost:3001/quotations/fetch-pdf?id=${response.data.pdfId}`, "_blank");
  
        // Reset form after successful submission
        setQuotation({
          customerName: "",
          address: "",
          phone: "",
          date: new Date().toISOString().split("T")[0],
          items: [],
          grandTotal: 0,
        });
        setCustomerSearch("");
        setSelectedProduct("");
        setError(null);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      let errorMessage = "Failed to save quotation. Please try again.";
  
      if (err.response) {
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = "No response from server. Check your connection.";
      } else {
        errorMessage = `Request error: ${err.message}`;
      }
  
      setError(errorMessage);
      console.error("Quotation submission error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  // Loading and error states
  if (loading && customers.length === 0) {
    return <div className="container mt-4 text-center">Loading...</div>;
  }
  
  if (error && customers.length === 0) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }
  

  return (
     <AdminPanel>
    <div className="container mt-4">
      <h2 className="mb-4">Generate Quotation</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="card p-3 mb-3">
              <h4>Customer Details</h4>
              
              {manualCustomer ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">Customer Name</label>
                    <input 
                      className="form-control" 
                      value={quotation.customerName}
                      onChange={(e) => setQuotation({...quotation, customerName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input 
                      className="form-control" 
                      value={quotation.address}
                      onChange={(e) => setQuotation({...quotation, address: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input 
                      className="form-control" 
                      value={quotation.phone}
                      onChange={(e) => setQuotation({...quotation, phone: e.target.value})}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label">Search Customer</label>
                    <input 
                      className="form-control" 
                      placeholder="Search Customer" 
                      value={customerSearch} 
                      onChange={(e) => {
                        setCustomerSearch(e.target.value); 
                        setShowAllCustomers(true);
                      }} 
                      onFocus={() => setShowAllCustomers(true)}
                      required
                    />
                  </div>
                  
                  {showAllCustomers && (
                    <div className="mb-3">
                      <ul className="list-group" style={{maxHeight: "200px", overflowY: "auto"}}>
                        {filteredCustomers.length > 0 ? (
                          filteredCustomers.map(customer => (
                            <li 
                              key={customer.customerName || Math.random()} 
                              className="list-group-item list-group-item-action" 
                              onClick={() => handleCustomerSelect(customer)}
                              style={{cursor: "pointer"}}
                            >
                              {customer.customerName || "Unnamed Customer"}
                            </li>
                          ))
                        ) : (
                          <li className="list-group-item text-muted">No customers found</li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleManualCustomer}
                  >
                    Enter Customer Manually
                  </button>
                </>
              )}
            </div>
            
            <div className="card p-3">
              <h4>Add Products</h4>
              
              <div className="mb-3">
                <label className="form-label">Search Product</label>
                <input 
                  className="form-control mb-2" 
                  placeholder="Search Product"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
                
                <select 
                  className="form-select" 
                  onChange={handleProductChange} 
                  value={selectedProduct}
                >
                  <option value="">Select Product</option>
                  {filteredProducts.map((product) => (
                    <option key={product.productId || Math.random()} value={product.productId}>
                      {product.productId || "Unnamed Product"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card p-3">
              <h3 className="mb-3">Quotation Details</h3>
              
              <div className="mb-3">
                <label className="form-label">Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={quotation.date}
                  onChange={(e) => setQuotation({...quotation, date: e.target.value})}
                />
              </div>
              
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Size</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Cost</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotation.items.length > 0 ? (
                      quotation.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.productId || "N/A"}</td>
                          <td>
                            <select 
                              className="form-select form-select-sm" 
                              onChange={(e) => handleSizeChange(index, e)}
                              value={item.size}
                              required
                            >
                              <option value="">Select Size</option>
                              {(item.sizes || []).map((s) => (
                                <option key={s.size || index} value={s.size}>
                                  {s.size || "N/A"}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input 
                              className="form-control form-control-sm" 
                              type="number" 
                              min="1"
                              value={item.quantity} 
                              onChange={(e) => handleQuantityChange(index, e)} 
                            />
                          </td>
                          <td>${(item.price || 0).toFixed(2)}</td>
                          <td>${(item.cost || 0).toFixed(2)}</td>
                          <td>
                            <button 
                              type="button"
                              className="btn btn-sm btn-danger" 
                              onClick={() => removeItem(index)}
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">
                          No products added
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <h3 className="mt-3 text-end">
                Grand Total: ${calculateGrandTotal().toFixed(2)}
              </h3>
              
              <div className="d-flex justify-content-end mt-3">
                <button 
                  type="submit" 
                  className="btn btn-primary me-2"
                  disabled={loading || quotation.items.length === 0}
                >
                  {loading ? "Processing..." : "Generate Quotation"}
                </button>
                
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setQuotation({
                      customerName: "",
                      address: "",
                      phone: "",
                      date: new Date().toISOString().split("T")[0],
                      items: [],
                      grandTotal: 0,
                    });
                    setCustomerSearch("");
                    setManualCustomer(false);
                    setError(null);
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    </AdminPanel>
  );
};

export default QuotationForm;