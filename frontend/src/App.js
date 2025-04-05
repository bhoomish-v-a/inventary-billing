import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/loginForm";
import AdminDashboard from "./pages/AdminDashboard";
import ExecutiveDashboard from "./pages/ExecutiveDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AddUser from "./pages/AddUser";
import AddProduct from "./pages/AddProduct";
import AddCustomer from "./pages/AddCustomer";
import Quotation from "./pages/Quatation";
import UpdateProduct from "./pages/UpdateProduct";
import PlaceOrder from "./pages/placeOrder";
import Inventary from "./pages/inventary";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/executive" element={<ProtectedRoute allowedRole="executive"><ExecutiveDashboard /></ProtectedRoute>} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/users" element={<AddUser />} />
        <Route path="/admin/quotation" element={<Quotation />} />
        <Route path="/admin/add-customer" element={<AddCustomer />} />
        <Route path="/admin/update-product" element={<UpdateProduct />} />
        <Route path="/admin/placeOrder" element={<PlaceOrder />} />
        <Route path="/admin/inventory" element={<Inventary />} />

      </Routes>
    </Router>
  );
};

export default App;
