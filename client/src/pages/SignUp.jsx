import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleLogin from "./GoogleLogin.jsx";
import FacebookLogin from "./FacebookLogin.jsx";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { register, isAuthenticated, loading, error } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const calculateStrength = (pwd) => {
    let s = 0;
    if (pwd.length >= 8) s += 25;
    if (/[a-z]/.test(pwd)) s += 25;
    if (/[A-Z]/.test(pwd)) s += 25;
    if (/[0-9]/.test(pwd)) s += 25;
    return s;
  };

  useEffect(() => {
    setPasswordStrength(calculateStrength(formData.password));
  }, [formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }
    await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name] || errors.general) {
      setErrors((prev) => ({ ...prev, [e.target.name]: null, general: null }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
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
            <User className="text-white w-6 h-6" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Join BlogPro
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create your account and start your journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-md flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" /> {error}
            </div>
          )}

          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              className="input-field pl-10"
              required
              aria-label="Username"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field pl-10"
              required
              aria-label="Email"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="input-field pl-10 pr-10"
              required
              aria-label="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
            {formData.password && (
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${passwordStrength}%` }}
                  className={`h-2 rounded-full ${
                    passwordStrength < 50
                      ? "bg-red-500"
                      : passwordStrength < 75
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                ></motion.div>
              </div>
            )}
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`input-field pl-10 pr-10 ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
              required
              aria-label="Confirm Password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
            {formData.confirmPassword && (
              <div className="absolute right-10 top-3">
                {formData.password === formData.confirmPassword ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            )}
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader className="w-5 h-5 mr-2 animate-spin" /> Creating
                account...
              </span>
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t dark:border-gray-600"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <GoogleLogin />
          <FacebookLogin />
        </div>

        <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          Already registered?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
