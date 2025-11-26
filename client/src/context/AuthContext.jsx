import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api from "../services/api";

export const AuthContext = createContext(null);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);

  /** 🔹 Initialize auth on load */
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        if (res?.data?.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        } else {
          localStorage.clear();
          setUser(null);
        }
      } catch (err) {
        console.warn("Auth init failed:", err.message);
        localStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  /** 🔹 Persist token/user */
  const setAuthState = (userData, token) => {
    if (token) localStorage.setItem("token", token);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
    setUser(userData);
  };

  /** 🔹 Refresh user data from API and update local storage */
  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get("/users/me");
      if (res?.data?.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        return { success: true, user: res.data.user };
      }
      return { success: false };
    } catch (err) {
      console.warn("refreshUser failed:", err.message);
      return { success: false, error: err.message };
    }
  }, []);
  /** 🔹 Login */
  const login = useCallback(async (formData) => {
    setAuthLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/login", formData, { withCredentials: true });
      if (res?.data?.token) {
        setAuthState(res.data.user, res.data.token);
        return { success: true, redirectTo: "/dashboard" };
      }
      throw new Error(res?.data?.message || "Invalid credentials");
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  /** 🔹 Register */
  const register = useCallback(async ({ username, email, password }) => {
    setAuthLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/register", { username, email, password }, { withCredentials: true });
      if (res?.data?.token) {
        setAuthState(res.data.user, res.data.token);
        return { success: true, redirectTo: "/dashboard" };
      }
      throw new Error(res?.data?.message || "Registration failed");
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  /** 🔹 Logout */
  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    setError(null);
    return { success: true, redirectTo: "/login" };
  }, []);

  /** 🔹 Email OTP */
  const sendEmailOtp = useCallback(async (email) => {
    try {
      const res = await api.post("/auth/otp/email/send", { email }, { withCredentials: true });
      return { success: res.data?.success, message: res.data?.message };
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message };
    }
  }, []);

  const verifyEmailOtp = useCallback(async (email, otp) => {
    try {
      const res = await api.post("/auth/otp/email/verify", { email, otp }, { withCredentials: true });
      if (res?.data?.token) {
        setAuthState(res.data.user, res.data.token);
        return { success: true, redirectTo: "/dashboard" };
      }
      return { success: false, error: res?.data?.message || "Verification failed" };
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message };
    }
  }, []);

  /** 🔹 Phone OTP */
  const sendPhoneOtp = useCallback(async (phone) => {
    try {
      const res = await api.post("/auth/otp/phone/send", { phone }, { withCredentials: true });
      return { success: res.data?.success, message: res.data?.message };
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message };
    }
  }, []);

  const verifyPhoneOtp = useCallback(async (phone, otp) => {
    try {
      const res = await api.post("/auth/otp/phone/verify", { phone, otp }, { withCredentials: true });
      if (res?.data?.token) {
        setAuthState(res.data.user, res.data.token);
        return { success: true, redirectTo: "/dashboard" };
      }
      return { success: false, error: res?.data?.message || "Verification failed" };
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message };
    }
  }, []);

  /** 🔹 Google */
  const googleLogin = useCallback(async (credential) => {
    try {
      const res = await api.post("/auth/google-auth", { credential }, { withCredentials: true });
      if (res?.data?.token) {
        setAuthState(res.data.user, res.data.token);
        return { success: true, redirectTo: "/dashboard" };
      }
      return { success: false, error: res?.data?.message || "Google login failed" };
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message };
    }
  }, []);

  /** 🔹 Facebook */
  const facebookLogin = useCallback(async (accessToken) => {
    try {
      const res = await api.post("/auth/facebook-auth", { accessToken }, { withCredentials: true });
      if (res?.data?.token) {
        setAuthState(res.data.user, res.data.token);
        return { success: true, redirectTo: "/dashboard" };
      }
      return { success: false, error: res?.data?.message || "Facebook login failed" };
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message };
    }
  }, []);

  const value = {
    user,
    loading,
    authLoading,
    refreshUser,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    sendEmailOtp,
    verifyEmailOtp,
    sendPhoneOtp,
    verifyPhoneOtp,
    googleLogin,
    facebookLogin,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-600">
        Initializing authentication...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
// src/context/AuthContext.jsx
// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
// } from "react";
// import api from "../services/api";

// export const AuthContext = createContext(null);

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// };

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     try {
//       const s = localStorage.getItem("user");
//       return s ? JSON.parse(s) : null;
//     } catch {
//       return null;
//     }
//   });
//   const [loading, setLoading] = useState(true); // for app init
//   const [authLoading, setAuthLoading] = useState(false); // for login/signup

//   const [error, setError] = useState(null);

//   /** 🔹 Initialize user on load */
//   useEffect(() => {
//     let mounted = true;
//     const init = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await api.get("/auth/me");
//         if (res?.data?.user) {
//           setUser(res.data.user);
//           localStorage.setItem("user", JSON.stringify(res.data.user));
//         } else {
//           localStorage.removeItem("token");
//           localStorage.removeItem("user");
//           setUser(null);
//         }
//       } catch (err) {
//         console.warn("Auth init failed:", err.message);
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         setUser(null);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };
//     init();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   /** 🔹 Helper to persist auth state */
//   const setAuthState = (userData, token) => {
//     if (token) localStorage.setItem("token", token);
//     if (userData) {
//       localStorage.setItem("user", JSON.stringify(userData));
//     } else {
//       localStorage.removeItem("user");
//     }
//     setUser(userData);
//   };

//   /** 🔹 Refresh user data from API and update local storage */
//   const refreshUser = useCallback(async () => {
//     try {
//       const res = await api.get("/users/me");
//       if (res?.data?.user) {
//         setUser(res.data.user);
//         localStorage.setItem("user", JSON.stringify(res.data.user));
//         return { success: true, user: res.data.user };
//       }
//       return { success: false };
//     } catch (err) {
//       console.warn("refreshUser failed:", err.message);
//       return { success: false, error: err.message };
//     }
//   }, []);

//   const login = useCallback(async (formData) => {
//     try {
//       setAuthLoading(true);
//       const res = await api.post("/auth/login", formData, { withCredentials: true });
//       if (res?.data?.token) {
//         setAuthState(res.data.user, res.data.token);
//         return true;
//       } else {
//         throw new Error(res?.data?.message || "Invalid credentials");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//       return false;
//     } finally {
//       setAuthLoading(false);
//     }
//   }, []);

//   const register = useCallback(async ({ username, email, password }) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.post("/auth/register", { username, email, password });
//       if (res?.data?.token) {
//         setAuthState(res.data.user, res.data.token);
//         return { success: true, redirectTo: "/dashboard" };
//       }
//       throw new Error(res?.data?.message || "Registration failed");
//     } catch (err) {
//       const msg = err?.response?.data?.message || err.message;
//       setError(msg);
//       return { success: false, error: msg };
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const logout = useCallback(() => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     setError(null);
//     return { success: true, redirectTo: "/login" };
//   }, []);

//   // OTP / social methods left unchanged (assuming earlier implementation exists)
//   const sendEmailOtp = useCallback(async (email) => {
//     try {
//       const res = await api.post("/auth/otp/email/send", { email });
//       return { success: res.data?.success, message: res.data?.message };
//     } catch (err) {
//       return { success: false, error: err?.response?.data?.message || err.message };
//     }
//   }, []);

//   const verifyEmailOtp = useCallback(async (email, otp) => {
//     try {
//       const res = await api.post("/auth/otp/email/verify", { email, otp });
//       if (res?.data?.token) {
//         setAuthState(res.data.user, res.data.token);
//         return { success: true, redirectTo: "/dashboard" };
//       }
//       return { success: false, error: res?.data?.message || "Verification failed" };
//     } catch (err) {
//       return { success: false, error: err?.response?.data?.message || err.message };
//     }
//   }, []);

//   const sendPhoneOtp = useCallback(async (phone) => {
//     try {
//       const res = await api.post("/auth/otp/phone/send", { phone });
//       return { success: res.data?.success, message: res.data?.message };
//     } catch (err) {
//       return { success: false, error: err?.response?.data?.message || err.message };
//     }
//   }, []);

//   const verifyPhoneOtp = useCallback(async (phone, otp) => {
//     try {
//       const res = await api.post("/auth/otp/phone/verify", { phone, otp });
//       if (res?.data?.token) {
//         setAuthState(res.data.user, res.data.token);
//         return { success: true, redirectTo: "/dashboard" };
//       }
//       return { success: false, error: res?.data?.message || "Verification failed" };
//     } catch (err) {
//       return { success: false, error: err?.response?.data?.message || err.message };
//     }
//   }, []);

//   const googleLogin = useCallback(async (credential) => {
//     try {
//       const res = await api.post("/auth/google-auth", { credential });
//       if (res?.data?.token) {
//         setAuthState(res.data.user, res.data.token);
//         return { success: true, redirectTo: "/dashboard" };
//       }
//       return { success: false, error: res?.data?.message || "Google login failed" };
//     } catch (err) {
//       return { success: false, error: err?.response?.data?.message || err.message };
//     }
//   }, []);

//   const facebookLogin = useCallback(async (accessToken) => {
//     try {
//       const res = await api.post("/auth/facebook-auth", { accessToken });
//       if (res?.data?.token) {
//         setAuthState(res.data.user, res.data.token);
//         return { success: true, redirectTo: "/dashboard" };
//       }
//       return { success: false, error: res?.data?.message || "Facebook login failed" };
//     } catch (err) {
//       return { success: false, error: err?.response?.data?.message || err.message };
//     }
//   }, []);

//   const value = {
//     user,
//     loading,
//     authLoading,
//     error,
//     isAuthenticated: !!user,
//     login,
//     register,
//     logout,
//     refreshUser, // <-- NEW
//     sendEmailOtp,
//     verifyEmailOtp,
//     sendPhoneOtp,
//     verifyPhoneOtp,
//     googleLogin,
//     facebookLogin,
//   };

//   if (loading) {
//     // Show a simple but visible loading indicator so pages don't appear blank
//     return (
//       <div className="flex items-center justify-center h-screen text-lg text-gray-600">
//         Initializing authentication...
//       </div>
//     );
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export default AuthProvider;
