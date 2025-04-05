import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form, Container, Row, Col, Modal, Alert } from "react-bootstrap";
import AdminPanel from "./AdminPanel";

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCustomer, setNewCustomer] = useState({ customerName: "", address: "", phone: "", gstin: "" });
  const [editCustomer, setEditCustomer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    setFilteredCustomers(
      customers.filter((customer) =>
        Object.values(customer).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }, [searchTerm, customers]);

    
  useEffect(() => {
    fetchCustomers();
  }, []);
  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/customers");
      setCustomers(response.data);
      setFilteredCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleChange = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  const validateGSTIN = (gstin) => {
    return gstin === "" || gstin.length === 15;
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateGSTIN(newCustomer.gstin)) {
      setAlert({ type: "danger", message: "GSTIN must be exactly 15 characters if provided." });
      return;
    }

    try {
      await axios.post("http://localhost:3001/customers", newCustomer);
      setAlert({ type: "success", message: "Customer added successfully!" });
      setNewCustomer({ customerName: "", address: "", phone: "", gstin: "" });
      fetchCustomers();
    } catch (error) {
      setAlert({ type: "danger", message: error.response?.data?.message || "Error adding customer." });
    }
  };

  const openEditModal = (customer) => {
    setEditCustomer({ ...customer });
    setAlert({ type: "", message: "" });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!validateGSTIN(editCustomer.gstin)) {
      setAlert({ type: "danger", message: "GSTIN must be exactly 15 characters if provided." });
      return;
    }

    try {
      await axios.put(`http://localhost:3001/customers/${editCustomer._id}`, editCustomer);
      setAlert({ type: "success", message: "Customer updated successfully!" });
      setShowEditModal(false);
      fetchCustomers();
    } catch (error) {
      setAlert({ type: "danger", message: error.response?.data?.message || "Error updating customer." });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/customers/${id}`);
      setAlert({ type: "success", message: "Customer deleted successfully!" });
      fetchCustomers();
    } catch (error) {
      setAlert({ type: "danger", message: error.response?.data?.message || "Error deleting customer." });
    }
  };

  return (
    <AdminPanel>
      <Container>
        <h2 className="mt-4">Manage Customers</h2>

        {/* ✅ Single Alert with Close Button */}
        {alert.message && (
          <Alert variant={alert.type} onClose={() => setAlert({ type: "", message: "" })} dismissible>
            {alert.message}
          </Alert>
        )}

        {/* ✅ Add Customer Form */}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={4}>
              <Form.Control type="text" name="customerName" placeholder="Customer Name" value={newCustomer.customerName} onChange={handleChange} required />
            </Col>
            <Col md={4}>
              <Form.Control type="text" name="address" placeholder="Address" value={newCustomer.address} onChange={handleChange} required />
            </Col>
            <Col md={4}>
              <Form.Control type="text" name="phone" placeholder="Phone" value={newCustomer.phone} onChange={handleChange} required />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col md={4}>
              <Form.Control type="text" name="gstin" placeholder="GSTIN (Optional, 15 characters)" value={newCustomer.gstin} onChange={handleChange} />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col className="text-center">
              <Button type="submit">Add Customer</Button>
            </Col>
          </Row>
        </Form>

        {/* ✅ Customer List Table */}
{/* Search Bar */}
<Form.Control
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={handleSearch}
          className="mb-3 mt-4 " 
        />

        {/* Customer Table */}
        <Table striped bordered hover >
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>GSTIN</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.customerName}</td>
                <td>{customer.address}</td>
                <td>{customer.phone}</td>
                <td>{customer.gstin}</td>
                <td>
                  <Button variant="warning" className="me-2" onClick={() => openEditModal(customer)}>Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(customer._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* ✅ Edit Customer Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Customer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {alert.type === "danger" && <Alert variant="danger">{alert.message}</Alert>} {/* Show only error alerts inside modal */}
            {editCustomer && (
              <Form>
                <Form.Group>
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control type="text" value={editCustomer.customerName} onChange={(e) => setEditCustomer({ ...editCustomer, customerName: e.target.value })} required />
                </Form.Group>
                <Form.Group className="mt-2">
                  <Form.Label>Address</Form.Label>
                  <Form.Control type="text" value={editCustomer.address} onChange={(e) => setEditCustomer({ ...editCustomer, address: e.target.value })} required />
                </Form.Group>
                <Form.Group className="mt-2">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="text" value={editCustomer.phone} onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })} required />
                </Form.Group>
                <Form.Group className="mt-2">
                  <Form.Label>GSTIN (Optional, 15 characters)</Form.Label>
                  <Form.Control type="text" value={editCustomer.gstin} onChange={(e) => setEditCustomer({ ...editCustomer, gstin: e.target.value })} />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
            <Button variant="primary" onClick={handleUpdate}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </AdminPanel>
  );
};

export default ManageCustomers;