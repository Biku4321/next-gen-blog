// import React from "react";
// import { GoogleOAuthProvider, GoogleLogin as GoogleLoginButton } from "@react-oauth/google";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const GoogleLogin = () => {
//   const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
//   const { googleLogin } = useAuth(); // ✅ FIXED: Use the context
//   const navigate = useNavigate();

//   const handleSuccess = async (credentialResponse) => {
//     const credential = credentialResponse?.credential;
//     if (!credential) {
//         alert("No credential received from Google");
//         return;
//     }

//     // ✅ FIXED: Centralize logic through AuthContext
//     const result = await googleLogin(credential);

//     if (result.success) {
//       navigate("/dashboard");
//     } else {
//       console.error("Google login failed:", result.error);
//       alert(result.error || "Google login failed on our server.");
//     }
//   };

//   const handleError = () => {
//     alert("Google Sign-In was unsuccessful. Please try again.");
//   };

//   return (
//   //   <GoogleOAuthProvider clientId={clientId}>
//   //       <GoogleLoginButton 
//   //           onSuccess={handleSuccess} 
//   //           onError={handleError} 
//   //           useOneTap 
//   //           width="100%"
//   //           theme="filled_blue"
//   //           shape="rectangular"
//   //       />
//   //   </GoogleOAuthProvider>
//   // );
//   <GoogleOAuthProvider clientId={clientId}>
//       <div className="flex items-center justify-center">
//         <GoogleLogin onSuccess={handleSuccess} onError={handleError} useOneTap />
//       </div>
//     </GoogleOAuthProvider>
//   );
// };

// export default GoogleLogin;
import React from "react";
import { GoogleOAuthProvider, GoogleLogin as GoogleLoginButton } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const GoogleLogin = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (response) => {
    const credential = response?.credential;
    if (!credential) return alert("No credential received from Google");

    const result = await googleLogin(credential);
    if (result.success) navigate("/dashboard");
    else alert(result.error || "Google login failed");
  };

  const handleError = () => alert("Google Sign-In failed. Try again.");

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex items-center justify-center">
        <GoogleLoginButton
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
          theme="filled_blue"
          width="100%"
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLogin;
