import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        email,
        password,
        role,
      });
    
      console.log("Server Response:", response.data); // Check full response
    
      if (!response.data || !response.data.role) {
        console.log("No role received!");
        return;
      }
    
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.role);
    
      setMessage({ text: response.data.message, type: "success" });
    
      setTimeout(() => {
        console.log("Navigating to:", response.data.role); // Should print role before redirect
    
        if (response.data.role === "admin") {
          console.log("Redirecting to /admin");
          navigate("/admin");
        } else if (response.data.role === "executive") {
          console.log("Redirecting to /executive");
          navigate("/executive");
        }
      }, 1000);
    } catch (error) {
      console.error("Login error:", error.response?.data || error);
      setMessage({ text: error.response?.data?.message || "Login failed", type: "danger" });
    }
    
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Login</h3>
        {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" className="form-control mb-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="form-control mb-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <select className="form-select mb-2" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="executive">Executive</option>
          </select>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
