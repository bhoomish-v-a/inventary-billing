import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminPanel from "./AdminPanel"; // Import Admin Panel

const AdminDashboard = () => {
  return (
    <AdminPanel>
      <h2 className="mb-4">Admin Dashboard</h2>
      <Row>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Add Products</Card.Title>
              <Card.Text>Add products with details.</Card.Text>
              <Button variant="primary" as={Link} to="/admin/add-product">Add products</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Add customer</Card.Title>
              <Card.Text>Maintain the customer details</Card.Text>
              <Button variant="primary" as={Link} to="/admin/add-customer">Manage Users</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Manage Users</Card.Title>
              <Card.Text>Manage user accounts and permissions.</Card.Text>
              <Button variant="primary" as={Link} to="/admin/users">Manage Users</Button>
            </Card.Body>
          </Card>
        </Col>
  
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Inventory</Card.Title>
              <Card.Text>Analyze and manage stock levels.</Card.Text>
              <Button variant="primary" as={Link} to="/admin/inventory">Check Inventory</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Quotation</Card.Title>
              <Card.Text>Gendrate quotation for the user.</Card.Text>
              <Button variant="primary" as={Link} to="/admin/quotation">Quotation</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Billing</Card.Title>
              <Card.Text>Gendrate a bill</Card.Text>
              <Button variant="primary" as={Link} to="/admin/bill">Quotation</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Report</Card.Title>
              <Card.Text>Analyize the report</Card.Text>
              <Button variant="primary" as={Link} to="/admin/report">Report</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </AdminPanel>
  );
};

export default AdminDashboard;
