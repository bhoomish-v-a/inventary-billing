import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import AdminPanel from "./AdminPanel";

const AddProduct = () => {
  const [product, setProduct] = useState({
    productId: "",
    hsnCode: "",
    gst: "",
    sizes: [],
  });
  const [sizeInput, setSizeInput] = useState({ size: "", rate: "", quantity: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null); // <-- NEW image state

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
    setError("");
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // set image
  };

  const validateGst = () => {
    if (product.gst < 0 || product.gst > 100) {
      setError("⚠️ GST must be between 0% and 100%!");
      return false;
    }
    return true;
  };

  const validateHsn = () => {
    if (!/^\d{6}$/.test(product.hsnCode)) {
      setError("⚠️ HSN Code must be exactly 6 digits!");
      return false;
    }
    return true;
  };

  const addSize = () => {
    if (!sizeInput.size || !sizeInput.rate || !sizeInput.quantity) {
      setError("⚠️ Size, price, and quantity are required!");
      return;
    }
    setProduct({ ...product, sizes: [...product.sizes, sizeInput] });
    setSizeInput({ size: "", rate: "", quantity: "" });
    setError("");
  };

  const removeSize = (index) => {
    setProduct({ ...product, sizes: product.sizes.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!validateGst() || !validateHsn()) return;

    if (!image) {
      setError("⚠️ Please select an image!");
      return;
    }

    const formData = new FormData();
    formData.append("productId", product.productId);
    formData.append("hsnCode", product.hsnCode);
    formData.append("gst", product.gst);
    formData.append("sizes", JSON.stringify(product.sizes)); // Convert array to string
    formData.append("image", image); // append image

    try {
      const response = await axios.post("http://localhost:3001/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(`${response.data.message}`);
      setProduct({ productId: "", hsnCode: "", gst: "", sizes: [] });
      setImage(null);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(`⚠️ ${error.response.data.message}`);
      } else {
        setError("❌ Server error! Please try again.");
      }
    }
  };

  return (
    <AdminPanel>
      <Container>
        <Row className="justify-content-md-center">
          <Col md={6}>
            <h2 className="mt-4">Add New Product</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}

            <Form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Product ID, HSN, GST Same */}
              <Form.Group className="mb-3">
                <Form.Label>Product ID</Form.Label>
                <Form.Control
                  type="text"
                  name="productId"
                  value={product.productId}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>HSN Code</Form.Label>
                <Form.Control
                  type="text"
                  name="hsnCode"
                  value={product.hsnCode}
                  onChange={handleChange}
                  onBlur={validateHsn}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>GST (%)</Form.Label>
                <Form.Control
                  type="number"
                  name="gst"
                  value={product.gst}
                  onChange={handleChange}
                  onBlur={validateGst}
                  required
                />
              </Form.Group>

              {/* Size Input Same */}
              <Form.Group className="mb-3">
                <Form.Label>Size, Price & Quantity</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Size"
                    value={sizeInput.size}
                    onChange={(e) => setSizeInput({ ...sizeInput, size: e.target.value })}
                  />
                  <Form.Control
                    type="number"
                    placeholder="Price"
                    value={sizeInput.rate}
                    onChange={(e) => setSizeInput({ ...sizeInput, rate: e.target.value })}
                  />
                  <Form.Control
                    type="number"
                    placeholder="Stock"
                    value={sizeInput.quantity}
                    onChange={(e) => setSizeInput({ ...sizeInput, quantity: e.target.value })}
                  />
                  <Button variant="secondary" onClick={addSize} disabled={!sizeInput.size || !sizeInput.rate || !sizeInput.quantity}>
                    Add
                  </Button>
                </div>
                <div className="mt-2">
                  {product.sizes.map((size, index) => (
                    <p key={index}>
                      {size.size} - ₹{size.rate} ({size.quantity} in stock){" "}
                      <Button size="sm" onClick={() => removeSize(index)}>×</Button>
                    </p>
                  ))}
                </div>
              </Form.Group>

              {/* NEW Image Upload Field */}
              <Form.Group className="mb-3">
                <Form.Label>Product Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit">Add Product</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </AdminPanel>
  );
};

export default AddProduct;
