import React, { useEffect, useState } from "react";
import BillingForm from "./BillingForm"; // adjust path as needed
import axios from "axios";

const BillingPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("/customers"); // adjust endpoint if needed
        setCustomers(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch customers", err);
        setCustomers([]);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) return <p>Loading...</p>;

  return <BillingForm customers={customers} />;
};

export default BillingPage;
