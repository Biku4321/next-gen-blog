import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EmailOtp = () => {
  const { sendEmailOtp, verifyEmailOtp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("send");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if(!email) return alert("Please enter an email");
    setLoading(true);
    const res = await sendEmailOtp(email);
    setLoading(false);
    if (res.success) {
      setStep("verify");
      alert(res.message);
    } else {
      alert(res.error || "Failed to send OTP");
    }
  };

  const handleVerify = async () => {
    if(!otp) return alert("Please enter OTP");
    setLoading(true);
    const res = await verifyEmailOtp(email, otp);
    setLoading(false);
    if (res.success) {
      navigate(res.redirectTo || "/dashboard");
    } else {
      alert(res.error || "Invalid OTP");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto space-y-4 p-5 shadow-lg rounded-lg bg-white mt-10">
      <h2 className="text-xl font-bold text-center text-gray-800">Email OTP Login</h2>
      
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={step === "verify"}
      />
      
      {step === "verify" && (
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          className="w-full p-3 border border-gray-300 rounded text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      )}

      <button
        onClick={step === "send" ? handleSend : handleVerify}
        disabled={loading}
        className={`w-full py-3 rounded text-white font-semibold transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Processing..." : step === "send" ? "Send OTP" : "Verify & Login"}
      </button>
    </div>
  );
};

export default EmailOtp;