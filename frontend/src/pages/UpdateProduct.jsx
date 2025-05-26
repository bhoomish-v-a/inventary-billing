import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import AdminPanel from "./AdminPanel";

const UpdateProduct = () => {
  const [action, setAction] = useState(""); // Stores selected action
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");

  const [updatePrice, setUpdatePrice] = useState("");
  const [updateGst, setUpdateGst] = useState("");
  const [updateStock, setUpdateStock] = useState("");

  const [newSize, setNewSize] = useState("");
  const [newSizeRate, setNewSizeRate] = useState("");
  const [newSizeGst, setNewSizeGst] = useState("");
  const [newSizeStock, setNewSizeStock] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/products")
      .then(response => setProducts(response.data))
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  useEffect(() => {
    if (productId) {
      const product = products.find(p => p.productId === productId);
      setSizes(product ? product.sizes : []);
    }
  }, [productId, products]);

  const handleUpdatePrice = async () => {
    if (!productId || !selectedSize || !updatePrice ) {
      setError("Product, size, price, and GST are required.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3001/products/${productId}/update-price`, {
        size: selectedSize,
        newRate: updatePrice,
        newGst: updateGst
      });

      setMessage(response.data.message);
      setUpdatePrice("");
      setUpdateGst("");
    } catch (error) {
      setMessage("Error updating price.");
    }
  };

  const handleUpdateStock = async () => {
    if (!productId || !selectedSize || !updateStock) {
      setError("Product, size, and new stock quantity are required.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3001/products/${productId}/update-stock`, {
        size: selectedSize,
        newQuantity: updateStock
      });

      setMessage(response.data.message);
      setUpdateStock("");
    } catch (error) {
      setMessage("Error updating stock.");
    }
  };

  const handleAddNewSize = async () => {
    if (!productId || !newSize || !newSizeRate || !newSizeStock ) {
      setError("All fields for new size are required.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3001/products/${productId}/add-size`, {
        size: newSize,
        rate: newSizeRate,
        gst: newSizeGst,
        quantity: newSizeStock
      });

      setMessage(response.data.message);
      setSizes([...sizes, { size: newSize, rate: newSizeRate, gst: newSizeGst, quantity: newSizeStock }]);
      setNewSize("");
      setNewSizeRate("");
      setNewSizeGst("");
      setNewSizeStock("");
    } catch (error) {
      setMessage("Error adding new size.");
    }
  };

  return (
    <AdminPanel>
      <Container>
        <Row className="justify-content-md-center">
          <Col md={6}>
            <h2 className="mt-4">Manage Product</h2>
            {message && <p className="alert alert-success">{message}</p>}
            {error && <p className="alert alert-danger">{error}</p>}
            

            {/* ACTION SELECTION */}
            <Form.Group className="mb-3">
              <Form.Label>Select Action</Form.Label>
              <Form.Select value={action} onChange={(e) => setAction(e.target.value)}>
                <option value="">Choose an action</option>
                <option value="updatePrice">Update Price</option>
                <option value="updateStock">Update Stock Quantity</option>
                <option value="addSize">Add New Size</option>
              </Form.Select>
            </Form.Group>

            {/* PRODUCT SELECTION */}
            {action && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Product ID</Form.Label>
                  <Form.Select value={productId} onChange={(e) => setProductId(e.target.value)}>
                    <option value="">Select a product</option>
                    {products.map((product, index) => (
                      <option key={index} value={product.productId}>{product.productId}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* SIZE SELECTION */}
                {action !== "addSize" && (
                  <Form.Group className="mb-3">
                    <Form.Label>Size</Form.Label>
                    <Form.Select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                      <option value="">Select a size</option>
                      {sizes.length > 0 ? (
                        sizes.map((sizeObj, index) => (
                          <option key={index} value={sizeObj.size}>{sizeObj.size}</option>
                        ))
                      ) : (
                        <option disabled>No sizes available</option>
                      )}
                    </Form.Select>
                  </Form.Group>
                )}
              </>
            )}

            {/* UPDATE PRICE & GST BLOCK */}
            {action === "updatePrice" && (
              <>
                <h4 className="mt-4">Update Price</h4>
                <Form.Group className="mb-3">
                  <Form.Label>New Price</Form.Label>
                  <Form.Control type="number" value={updatePrice} onChange={(e) => setUpdatePrice(e.target.value)} />
                </Form.Group>
                
                <Button variant="warning" onClick={handleUpdatePrice}>Update Price</Button>
              </>
            )}

            {/* UPDATE STOCK QUANTITY BLOCK */}
            {action === "updateStock" && (
              <>
                <h4 className="mt-4">Update Stock Quantity</h4>
                <Form.Group className="mb-3">
                  <Form.Label>New Stock Quantity</Form.Label>
                  <Form.Control type="number" value={updateStock} onChange={(e) => setUpdateStock(e.target.value)} />
                </Form.Group>
                <Button variant="info" onClick={handleUpdateStock}>Update Stock</Button>
              </>
            )}

            {/* ADD NEW SIZE BLOCK */}
            {action === "addSize" && (
              <>
                <h4 className="mt-4">Add New Size</h4>
                <Form.Group className="mb-3">
                  <Form.Label>New Size</Form.Label>
                  <Form.Control type="text" value={newSize} onChange={(e) => setNewSize(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Rate</Form.Label>
                  <Form.Control type="number" value={newSizeRate} onChange={(e) => setNewSizeRate(e.target.value)} />
                </Form.Group>
             
                <Form.Group className="mb-3">
                  <Form.Label>Stock Quantity</Form.Label>
                  <Form.Control type="number" value={newSizeStock} onChange={(e) => setNewSizeStock(e.target.value)} />
                </Form.Group>
                <Button variant="success" onClick={handleAddNewSize}>Add New Size</Button>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </AdminPanel>
  );
};

export default UpdateProduct;
