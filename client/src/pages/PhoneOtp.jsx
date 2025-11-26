import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PhoneOtp = () => {
  const { sendPhoneOtp, verifyPhoneOtp, authLoading } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("enterPhone");
  const [error, setError] = useState("");

  const handleSend = async () => {
    setError("");
    if (!/^\+?\d{10,15}$/.test(phone)) return setError("Enter a valid phone (e.g., +1234567890)");
    
    const res = await sendPhoneOtp(phone);
    if (res.success) {
      setStep("verifyOtp");
    } else {
      setError(res.error || "Failed to send SMS");
    }
  };

  const handleVerify = async () => {
    setError("");
    if(!otp) return setError("Please enter the OTP");

    const res = await verifyPhoneOtp(phone, otp);
    if (res.success) {
      navigate(res.redirectTo || "/dashboard");
    } else {
      setError(res.error || "Invalid OTP");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto space-y-4 p-5 shadow-lg rounded-lg bg-white mt-10">
      <h2 className="text-xl font-bold text-center text-gray-800">Phone Login</h2>
      {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}

      {step === "enterPhone" ? (
        <>
          <input
            type="tel"
            placeholder="+1234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleSend} 
            disabled={authLoading} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold transition"
          >
            {authLoading ? "Sending..." : "Send OTP"}
          </button>
        </>
      ) : (
        <>
          <p className="text-center text-gray-600 text-sm">Sent to {phone}</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button 
            onClick={handleVerify} 
            disabled={authLoading} 
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold transition"
          >
            {authLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}
    </div>
  );
};

export default PhoneOtp;