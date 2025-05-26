import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminPanel from "./AdminPanel";
import Select from "react-select";

const BillForm = () => {
  const [quotation, setQuotation] = useState({
    customerName: "",
    address: "",
    phone: "",
    date: new Date().toISOString().split("T")[0],
    items: [],
    grandTotal: 0,
    gst: 0,
    totalWithGST: 0,
  });
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manualCustomer, setManualCustomer] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customersRes, productsRes] = await Promise.all([
          axios.get("http://localhost:3001/customers"),
          axios.get("http://localhost:3001/products"),
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

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) =>
      (c?.customerName?.toLowerCase() || "").includes(
        (customerSearch?.toLowerCase() || "")
      )
    );
  }, [customers, customerSearch]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      (p?.productName?.toLowerCase() || "").includes(
        (productSearch?.toLowerCase() || "")
      )
    );
  }, [products, productSearch]);

  const handleCustomerSelect = (customer) => {
    if (!customer) return;
    setQuotation({
      ...quotation,
      customerName: customer.customerName || "",
      address: customer.address || "",
      phone: customer.phone || "",
    });
    setCustomerSearch(customer.customerName || "");
    setManualCustomer(false);
  };

  const handleManualCustomer = () => {
    setQuotation({
      ...quotation,
      customerName: "",
      address: "",
      phone: "",
    });
    setCustomerSearch("");
    setManualCustomer(true);
  };

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

  const handleSizeChange = (index, e) => {
    if (index < 0 || index >= quotation.items.length) return;
    const newItems = [...quotation.items];
    const selectedSize = newItems[index]?.sizes?.find((s) => s.size === e.target.value);
    if (selectedSize) {
      newItems[index] = {
        ...newItems[index],
        size: selectedSize.size || "",
        price: selectedSize.rate || 0,
        cost: (selectedSize.rate || 0) * (newItems[index].quantity || 1),
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
      cost: quantity * (newItems[index].price || 0),
    };
    setQuotation({ ...quotation, items: newItems });
  };

  const removeItem = (index) => {
    if (index < 0 || index >= quotation.items.length) return;
    const newItems = [...quotation.items];
    newItems.splice(index, 1);
    setQuotation({ ...quotation, items: newItems });
  };

  const calculateGrandTotal = () => {
    return quotation.items.reduce((sum, item) => sum + (item.cost || 0), 0);
  };

  const calculateGST = (amount) => {
    const gstRate = 0.18; // Assuming 18% GST
    return amount * gstRate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      const totalWithoutGST = calculateGrandTotal();
      const gstAmount = calculateGST(totalWithoutGST);
      const totalWithGST = totalWithoutGST + gstAmount;

      const requestData = {
        customerName: quotation.customerName,
        address: quotation.address,
        phone: quotation.phone,
        date: quotation.date,
        items: quotation.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          size: item.size,
          quantity: Number(item.quantity),
          price: Number(item.price),
          cost: Number(item.cost),
        })),
        grandTotal: Number(totalWithoutGST.toFixed(2)),
        gst: Number(gstAmount.toFixed(2)),
        totalWithGST: Number(totalWithGST.toFixed(2)),
      };
      console.log("Sending to backend:", requestData);
      

      const response = await axios.post("http://localhost:3001/bill/create-pdf", requestData);

      if (response.status === 200) {
        window.open(`http://localhost:3001/bill/fetch-pdf?billNumber=${response.data.billNumber}`, "_blank");

        setQuotation({
          customerName: "",
          address: "",
          phone: "",
          date: new Date().toISOString().split("T")[0],
          items: [],
          grandTotal: 0,
          gst: 0,
          totalWithGST: 0,
        });
        setError(null);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
    //   console.error("PDF generation error:", err);
    // return;
      let errorMessage = "Failed to save bill. Please try again.";
      if (err.response) {
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = "No response from server. Check your connection.";
      } else {
        errorMessage = `Request error: ${err.message}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPanel>
      <div className="container mt-4">
        <h2 className="mb-4">Billing</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Customer and Product Selection Section */}
          <div className="row">
            <div className="col-md-4">
              {/* Customer Details */}
              <div className="card p-3 mb-3">
                <h4>Customer Details</h4>
                {manualCustomer ? (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Customer Name</label>
                      <input
                        className="form-control"
                        value={quotation.customerName}
                        onChange={(e) => setQuotation({ ...quotation, customerName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <input
                        className="form-control"
                        value={quotation.address}
                        onChange={(e) => setQuotation({ ...quotation, address: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        className="form-control"
                        value={quotation.phone}
                        onChange={(e) => setQuotation({ ...quotation, phone: e.target.value })}
                      />
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setManualCustomer(false)}
                    >
                      Select Existing Customer
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Select Customer</label>
                      <select
                        className="form-select"
                        value={quotation.customerName}
                        onChange={(e) => {
                          const selectedCustomer = customers.find(c => c.customerName === e.target.value);
                          handleCustomerSelect(selectedCustomer);
                        }}
                        required
                      >
                        <option value="">-- Select Customer --</option>
                        {customers.map((customer, index) => (
                          <option key={index} value={customer.customerName}>
                            {customer.customerName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* <div className="mb-3">
                      <label className="form-label">Address</label>
                      <input
                        className="form-control"
                        value={quotation.address}
                        readOnly
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        className="form-control"
                        value={quotation.phone}
                        readOnly
                      />
                    </div> */}

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

              {/* Product Selection */}
              <div className="card p-3">
                <h4>Add Products</h4>
                <div className="mb-3">
                  <label className="form-label">Search Product</label>
                  <Select
                    options={filteredProducts.map(product => ({
                      value: product.productId,
                      label: product.productId ,
                    }))}
                    onChange={(selectedOption) => {
                      if (!selectedOption) return;

                      const product = products.find((p) => p.productId === selectedOption.value);

                      if (product && !quotation.items.some((item) => item.productId === product.productId)) {
                        setQuotation({
                          ...quotation,
                          items: [
                            ...quotation.items,
                            {
                              productId: product.productId || '',
                              productId: product.productId,
                              size: '',
                              quantity: 1,
                              price: 0,
                              cost: 0,
                              sizes: product.sizes || [],
                            },
                          ],
                        });
                      }
                    }}
                    placeholder="Type to search products..."
                    isClearable
                  />
                </div>
              </div>
            </div>

            {/* Product Table Section */}
            <div className="col-md-8">
              <div className="card p-3">
                <h3 className="mb-3">Bill Details</h3>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Size</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>GST</th>
                        <th>Cost</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotation.items.length > 0 ? (
                        quotation.items.map((item, index) => {
                          const product = products.find(p => p.productId === item.productId);
                          const gstPercentage = product ? product.gst || 0 : 0;
                          return (
                            <tr key={index}>
                              <td>{item.productId}</td>
                              <td>
                                <select
                                  className="form-control"
                                  value={item.size}
                                  onChange={(e) => handleSizeChange(index, e)}
                                >
                                  <option value="">Select Size</option>
                                  {item.sizes?.map((size) => (
                                    <option key={size.size} value={size.size}>
                                      {size.size}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityChange(index, e)}
                                />
                              </td>
                              <td>{item.price}</td>
                              <td>{(gstPercentage / 100) * item.price}</td>
                              <td>{item.cost}</td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() => removeItem(index)}
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="7">No products added</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="mt-3">
                  <div className="row">
                    <div className="col-md-6">
                      <strong>Grand Total</strong>
                    </div>
                    <div className="col-md-6 text-end">
                      <strong>{calculateGrandTotal()}</strong>
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-md-6">
                      <strong>GST (18%)</strong>
                    </div>
                    <div className="col-md-6 text-end">
                      <strong>{calculateGST(calculateGrandTotal())}</strong>
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-md-6">
                      <strong>Total with GST</strong>
                    </div>
                    <div className="col-md-6 text-end">
                      <strong>{calculateGrandTotal() + calculateGST(calculateGrandTotal())}</strong>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary btn-block mt-3"
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Bill"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminPanel>
  );
};

export default BillForm;
