import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionId = searchParams.get("id");
  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    if (transactionId) {
      checkStatus(transactionId);
    }
  }, [transactionId]);

  const checkStatus = async (id) => {
    try {
      const res = await fetch("http://localhost:5000/api/payment/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchantTransactionId: id }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("✅ Payment Successful! Account Activated.");
        setTimeout(() => navigate("/dashboard"), 3000);
      } else {
        setStatus("❌ Payment Failed. Please try again.");
      }
    } catch (err) {
      setStatus("Error connecting to server.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <h2 className="text-2xl font-bold">{status}</h2>
      <p className="text-gray-500 mt-2">Transaction ID: {transactionId}</p>
    </div>
  );
};

export default PaymentSuccess;
