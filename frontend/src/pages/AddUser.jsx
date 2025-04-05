import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Table, Alert, Card } from "react-bootstrap";
import AdminPanel from "./AdminPanel";

const AddUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("executive");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get("http://localhost:3001/users");
    setUsers(response.data);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:3001/users", {
        email,
        password,
        confirmPassword,
        role,
      });
      setMessage("User added successfully");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      fetchUsers();
    } catch (error) {
      setMessage("Error adding user");
    }
  };

  const handleDeleteUser = async (id) => {
    await axios.delete(`http://localhost:3001/users/${id}`);
    fetchUsers();
  };

  return (
    <AdminPanel>
      <Container>
        <Row>
          {/* Left Column: Manage User */}
          <Col md={6}>
            <Card className="shadow-sm p-3">
              <h4 className="mb-3">Manage User</h4>
              {message && <Alert variant="info">{message}</Alert>}
              <Form onSubmit={handleAddUser}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="admin">Admin</option>
                    <option value="executive">Executive</option>
                  </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit">Add User</Button>
              </Form>
            </Card>
          </Col>

          {/* Right Column: User List */}
          <Col md={6}>
            <Card className="shadow-sm p-3">
              <h4 className="mb-3">User List</h4>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user._id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </AdminPanel>
  );
};

export default AddUser;
