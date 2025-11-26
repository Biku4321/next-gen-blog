import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Smartphone,
  AlertCircle,
  Loader,
  LogIn,
  MailCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import GoogleLogin from "./GoogleLogin.jsx";
import FacebookLogin from "./FacebookLogin.jsx";
import EmailOtp from "./EmailOtp.jsx";
import PhoneOtp from "./PhoneOtp.jsx";

const Login = () => {
  const [mode, setMode] = useState("password"); // "password" | "emailOtp" | "phoneOtp"
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { login, isAuthenticated, authLoading, error } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";
    if (mode === "password") {
      if (!formData.password) newErrors.password = "Password required";
      else if (formData.password.length < 6)
        newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  const success = await login(formData);
  if (success) navigate("/dashboard");
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-3xl max-w-md w-full shadow-2xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4"
          >
            <LogIn className="text-white w-6 h-6" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account securely
          </p>
        </div>

        <div className="flex justify-center mb-6 space-x-2">
          {[
            { id: "password", label: "Password", icon: Lock },
            { id: "emailOtp", label: "Email OTP", icon: MailCheck },
            { id: "phoneOtp", label: "Phone OTP", icon: Smartphone },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`px-3 py-2 text-sm font-medium rounded-xl flex items-center gap-1 ${
                mode === id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "glass-button text-gray-700 dark:text-gray-300 hover:bg-white/10"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {mode === "password" && (
            <motion.form
              key="password"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-md flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, email: e.target.value }))
                    }
                    className={`input-field pl-10 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, password: e.target.value }))
                    }
                    className={`input-field pl-10 pr-10 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1">{errors.password}</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
              >
                {authLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader className="w-5 h-5 mr-2 animate-spin" /> Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </motion.button>
            </motion.form>
          )}

          {mode === "emailOtp" && <EmailOtp />}
          {mode === "phoneOtp" && <PhoneOtp />}
        </AnimatePresence>

        <div className="mt-8 space-y-2">
          <GoogleLogin />
          <FacebookLogin />
        </div>

        <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
            Create one
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Mail, Lock, Smartphone, AlertCircle, Loader } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import GoogleLogin from './GoogleLogin';
// import FacebookLogin from './FacebookLogin';

// // --- Sub-components for different login flows ---

// const PasswordFlow = () => {
//     const { login, actionLoading } = useAuth();
//     const [formData, setFormData] = useState({ email: '', password: '' });

//     const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         await login(formData.email, formData.password);
//     };

//     return (
//         <form className="space-y-4" onSubmit={handleSubmit}>
//             <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
//                 <input name="email" type="email" required className="input-field pl-10" placeholder="Email address" value={formData.email} onChange={handleChange}/>
//             </div>
//             <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
//                 <input name="password" type="password" required className="input-field pl-10" placeholder="Password" value={formData.password} onChange={handleChange}/>
//             </div>
//             <button type="submit" disabled={actionLoading} className="w-full btn-primary flex justify-center py-2.5 disabled:opacity-60">
//                 {actionLoading ? <Loader className="animate-spin" /> : 'Sign In'}
//             </button>
//         </form>
//     );
// };

// const OtpFlow = ({ isEmail }) => {
//     const { sendEmailOtp, verifyEmailOtp, sendPhoneOtp, verifyPhoneOtp, actionLoading } = useAuth();
//     const [contact, setContact] = useState('');
//     const [otp, setOtp] = useState('');
//     const [step, setStep] = useState('send');
//     const [message, setMessage] = useState('');

//     const handleSend = async () => {
//         setMessage('');
//         const res = isEmail ? await sendEmailOtp(contact) : await sendPhoneOtp(contact);
//         if(res.success) {
//             setMessage(res.message || 'OTP Sent!');
//             setStep('verify');
//         }
//     };

//     const handleVerify = async () => {
//         isEmail ? await verifyEmailOtp(contact, otp) : await verifyPhoneOtp(contact, otp);
//     };

//     return (
//         <div className="space-y-4">
//             {message && <p className="text-green-600 text-sm text-center">{message}</p>}
//             <div className="relative">
//                 {isEmail ? <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/> : <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>}
//                 <input type={isEmail ? 'email' : 'tel'} placeholder={isEmail ? 'Email Address' : 'Phone Number (+1...)'} value={contact} onChange={(e) => setContact(e.target.value)} disabled={step === 'verify'} className="input-field pl-10" />
//             </div>
//             {step === 'verify' && (
//                 <div className="relative">
//                     <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" className="input-field text-center tracking-widest"/>
//                 </div>
//             )}
//             <button onClick={step === 'send' ? handleSend : handleVerify} disabled={actionLoading} className="w-full btn-primary flex justify-center py-2.5 disabled:opacity-60">
//                 {actionLoading ? <Loader className="animate-spin" /> : (step === 'send' ? 'Send OTP' : 'Verify & Sign In')}
//             </button>
//         </div>
//     );
// };

// // --- Main Login Component ---

// const Login = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated, error, clearError } = useAuth();
//   const [mode, setMode] = useState('password'); // password, emailOtp, phoneOtp

//   useEffect(() => {
//     if (isAuthenticated) navigate('/dashboard');
//   }, [isAuthenticated, navigate]);

//   useEffect(() => {
//     clearError();
//   }, [mode, clearError]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
//       >
//         <div className="text-center">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sign In</h1>
//         </div>

//         {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
//                 <AlertCircle className="inline w-4 h-4 mr-2" />
//                 <span>{error}</span>
//             </div>
//         )}

//         <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg p-1 space-x-1">
//             <button onClick={() => setMode('password')} className={`w-full py-2 text-sm rounded-md transition-colors ${mode === 'password' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Password</button>
//             <button onClick={() => setMode('emailOtp')} className={`w-full py-2 text-sm rounded-md transition-colors ${mode === 'emailOtp' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Email</button>
//             <button onClick={() => setMode('phoneOtp')} className={`w-full py-2 text-sm rounded-md transition-colors ${mode === 'phoneOtp' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Phone</button>
//         </div>

//         <AnimatePresence mode="wait">
//             <motion.div
//                 key={mode}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.2 }}
//             >
//                 {mode === 'password' && <PasswordFlow />}
//                 {mode === 'emailOtp' && <OtpFlow isEmail={true} />}
//                 {mode === 'phoneOtp' && <OtpFlow isEmail={false} />}
//             </motion.div>
//         </AnimatePresence>

//         <div className="relative my-4">
//             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-600" /></div>
//             <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or sign in with</span></div>
//         </div>

//         <div className="space-y-3">
//             <GoogleLogin />
//             <FacebookLogin />
//         </div>

//         <p className="text-center text-sm text-gray-600 dark:text-gray-400">
//           Don't have an account?{' '}
//           <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
//             Sign Up
//           </Link>
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;
