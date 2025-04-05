import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Home, Box, Users, FileText, Clipboard, BarChart, LogOut } from "react-feather";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminPanel = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
<Container fluid className="p-0 min-vh-100 d-flex">
  {/* Sidebar */}
  <Col md={2} className="bg-dark text-white p-4 d-flex flex-column vh-100 position-fixed">
    <h4 className="text-center mb-4">Admin Panel</h4>
    <ul className="list-unstyled">
      <li className="mb-3">
        <Link to="/admin" className="text-white text-decoration-none d-flex align-items-center">
          <Home size={18} className="me-2" /> Dashboard
        </Link>
      </li>
      <li className="mb-3">
        <Link to="/admin/add-product" className="text-white text-decoration-none d-flex align-items-center">
          <Box size={18} className="me-2" /> Add Product
        </Link>
      </li>
      <li className="mb-3">
        <Link to="/admin/update-product" className="text-white text-decoration-none d-flex align-items-center">
          <Box size={18} className="me-2" /> Update Product
        </Link>
      </li>
      <li className="mb-3">
        <Link to="/admin/users" className="text-white text-decoration-none d-flex align-items-center">
          <Users size={18} className="me-2" /> Manage Users
        </Link>
      </li>
      <li className="mb-3">
        <Link to="/admin/add-customer" className="text-white text-decoration-none d-flex align-items-center">
          <Clipboard size={18} className="me-2" /> Add Customer
        </Link>
      </li>
      <li className="mb-3">
        <Link to="/admin/inventory" className="text-white text-decoration-none d-flex align-items-center">
          <FileText size={18} className="me-2" /> Inventory
        </Link>
      </li>
      <li className="mb-3">
        <Link to="/admin/reports" className="text-white text-decoration-none d-flex align-items-center">
          <BarChart size={18} className="me-2" /> Reports
        </Link>
      </li>
      <li className="mb-3">
        <Link to="/admin/quotation" className="text-white text-decoration-none d-flex align-items-center">
          <FileText size={18} className="me-2" /> Quotation
        </Link>
      </li>

    </ul>
    
    <Button variant="danger" className="mt-auto d-flex align-items-center justify-content-center" onClick={handleLogout}>
      <LogOut size={18} className="me-2" /> Logout
    </Button>
  </Col>

  {/* Main Content */}
  <Col md={{ span: 10, offset: 2 }} className="p-4 bg-light vh-100 overflow-auto">
    {children}
  </Col>
</Container>
  );
};

export default AdminPanel;
