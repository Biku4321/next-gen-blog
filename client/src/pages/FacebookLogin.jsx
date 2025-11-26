
// // import React, { useEffect } from "react";
// // import { Facebook } from "lucide-react";
// // import { useAuth } from "../context/AuthContext"; // ✅ FIXED: Import useAuth
// // import { useNavigate } from "react-router-dom"; // ✅ FIXED: Import useNavigate

// // const FacebookLogin = () => {
// //   const appId = import.meta.env.VITE_FACEBOOK_APP_ID;
// //   const { facebookLogin } = useAuth(); // ✅ FIXED: Use the context
// //   const navigate = useNavigate(); // ✅ FIXED: Use navigate for redirection

// //   useEffect(() => {
// //     if (!appId) {
// //       console.warn("VITE_FACEBOOK_APP_ID not set");
// //       return;
// //     }
// //     // Load Facebook SDK
// //   //   window.fbAsyncInit = function () {
// //   //     FB.init({
// //   //       appId: FACEBOOK_APP_ID,
// //   //       cookie: true,
// //   //       xfbml: true,
// //   //       version: "v19.0",
// //   //     });
// //   //   };

// //   //   // Dynamically load SDK script
// //   //   (function (d, s, id) {
// //   //     var js,
// //   //       fjs = d.getElementsByTagName(s)[0];
// //   //     if (d.getElementById(id)) return;
// //   //     js = d.createElement(s);
// //   //     js.id = id;
// //   //     js.src = "https://connect.facebook.net/en_US/sdk.js";
// //   //     fjs.parentNode.insertBefore(js, fjs);
// //   //   })(document, "script", "facebook-jssdk");
// //   // }, [FACEBOOK_APP_ID]);
// //   if (!window.FB) {
// //       window.fbAsyncInit = function () {
// //         window.FB.init({ appId, cookie: true, xfbml: true, version: "v18.0" });
// //       };
// //       const script = document.createElement("script");
// //       script.src = "https://connect.facebook.net/en_US/sdk.js";
// //       script.async = true;
// //       document.body.appendChild(script);
// //     }
// //   }, [appId]);


// //   // const handleFacebookLogin = () => {
// //   //   if (!window.FB) {
// //   //       alert("Facebook SDK not loaded yet.");
// //   //       return;
// //   //   }

// //   //   FB.login(
// //   //     async function (response) { // ✅ FIXED: Make this async
// //   //       if (response.authResponse) {
// //   //         const { accessToken } = response.authResponse;
          
// //   //         // ✅ FIXED: Centralize logic through AuthContext
// //   //         const result = await facebookLogin(accessToken);

// //   //         if (result.success) {
// //   //           navigate("/dashboard");
// //   //         } else {
// //   //           alert(result.message || "Facebook login failed");
// //   //         }
// //   //       } else {
// //   //         alert("Facebook login cancelled or failed");
// //   //       }
// //   //     },
// //   //     { scope: "email,public_profile" }
// //   //   );
// //   // };

// //   const handleFacebookLogin = () => {
// //     if (!window.FB) return alert("Facebook SDK not loaded yet");
// //     window.FB.login(
// //       async (response) => {
// //         if (response.authResponse) {
// //           const { accessToken } = response.authResponse;
// //           const res = await facebookLogin(accessToken);
// //           if (res.success) navigate(res.redirectTo || "/dashboard");
// //           else alert(res.error || "Facebook login failed");
// //         } else {
// //           alert("Facebook login cancelled");
// //         }
// //       },
// //       { scope: "email,public_profile" }
// //     );
// //   };

// //   return (
// //     <button onClick={handleFacebookLogin} className="w-full py-3 mt-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-medium flex items-center justify-center gap-2">
// //       <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-2.9h2V9.5c0-2 1.2-3.2 3.1-3.2.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2v1.4h2.4l-.4 2.9h-2v7A10 10 0 0 0 22 12"/></svg>
// //       Continue with Facebook
// //     </button>
// //   );
// // };

// // export default FacebookLogin;
// // src/pages/FacebookLogin.jsx
// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";

// const FacebookLogin = () => {
//   const { facebookLogin } = useAuth();
//   const appId = import.meta.env.VITE_FACEBOOK_APP_ID;
//   const [sdkLoaded, setSdkLoaded] = useState(false);

//   // useEffect(() => {
//   //   if (!appId) {
//   //     console.warn("VITE_FACEBOOK_APP_ID not set");
//   //     return;
//   //   }
//   //   if (window.FB) {
//   //     setSdkLoaded(true);
//   //     return;
//   //   }
//   //   window.fbAsyncInit = function () {
//   //     window.FB.init({ appId, cookie: true, xfbml: true, version: "v18.0" });
//   //     setSdkLoaded(true);
//   //   };
//   //   const s = document.createElement("script");
//   //   s.src = "https://connect.facebook.net/en_US/sdk.js";
//   //   s.async = true;
//   //   s.defer = true;
//   //   document.body.appendChild(s);
//   //   return () => { /* cleanup not necessary */ };
//   // }, [appId]);
// useEffect(() => {
//   if (!appId) {
//     console.warn("VITE_FACEBOOK_APP_ID not set");
//     return;
//   }

//   const checkFBReady = () => {
//     if (window.FB && window.FB.getLoginStatus) {
//       setSdkLoaded(true);
//     } else {
//       setTimeout(checkFBReady, 500);
//     }
//   };

//   window.fbAsyncInit = function () {
//     window.FB.init({
//       appId,
//       cookie: true,
//       xfbml: true,
//       version: "v18.0",
//     });
//     checkFBReady();
//   };

//   const script = document.createElement("script");
//   script.src = "https://connect.facebook.net/en_US/sdk.js";
//   script.async = true;
//   document.body.appendChild(script);

//   return () => document.body.removeChild(script);
// }, [appId]);

//   const handleClick = () => {
//     if (!sdkLoaded || !window.FB) return alert("Facebook SDK loading. Try again in a second.");
//     window.FB.login(
//       async (resp) => {
//         if (resp?.authResponse?.accessToken) {
//           const accessToken = resp.authResponse.accessToken;
//           const res = await facebookLogin(accessToken);
//           if (res.success) {
//             window.location.href = res.redirectTo || "/dashboard";
//           } else {
//             alert(res.error || "Facebook login failed");
//           }
//         } else {
//           alert("Facebook login cancelled");
//         }
//       },
//       { scope: "email,public_profile" }
//     );
//   };

//   // Render fallback if app ID missing
//   if (!appId) {
//     return <div className="text-red-500 text-sm text-center">Facebook App ID missing</div>;
//   }

//   // Render a disabled loading button while SDK loads
//   if (!sdkLoaded) {
//     return (
//       <button
//         disabled
//         className="w-full py-3 rounded-xl bg-[#1877F2]/50 text-white flex items-center justify-center gap-2"
//       >
//         Loading Facebook...
//       </button>
//     );
//   }

//   // SDK loaded — return the active button
//   return (
//     <button
//       onClick={handleClick}
//       className="w-full py-3 rounded-xl bg-[#1877F2] text-white flex items-center justify-center gap-2"
//     >
//       Continue with Facebook
//     </button>
//   );
// };

// export default FacebookLogin;
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const FacebookLogin = () => {
  const { facebookLogin } = useAuth();
  const appId = import.meta.env.VITE_FACEBOOK_APP_ID;
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    if (!appId) {
      console.warn("VITE_FACEBOOK_APP_ID not set");
      return;
    }

    const checkFBReady = () => {
      if (window.FB && window.FB.getLoginStatus) {
        setSdkLoaded(true);
      } else {
        setTimeout(checkFBReady, 400);
      }
    };

    window.fbAsyncInit = function () {
      window.FB.init({
        appId,
        cookie: true,
        xfbml: true,
        version: "v18.0",
      });
      checkFBReady();
    };

    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [appId]);

  const handleClick = () => {
    if (!sdkLoaded || !window.FB)
      return alert("Facebook SDK still loading. Try again shortly.");

    window.FB.login(
      async (resp) => {
        if (resp?.authResponse?.accessToken) {
          const result = await facebookLogin(resp.authResponse.accessToken);
          if (result.success) window.location.href = result.redirectTo || "/dashboard";
          else alert(result.error || "Facebook login failed");
        } else {
          alert("Facebook login cancelled.");
        }
      },
      { scope: "email,public_profile" }
    );
  };

  if (!appId)
    return <div className="text-red-500 text-center">Facebook App ID missing</div>;

  if (!sdkLoaded)
    return (
      <button disabled className="w-full py-3 rounded-xl bg-[#1877F2]/60 text-white">
        Loading Facebook...
      </button>
    );

  return (
    <button
      onClick={handleClick}
      className="w-full py-3 rounded-xl bg-[#1877F2] text-white flex items-center justify-center gap-2"
    >
      Continue with Facebook
    </button>
  );
};

export default FacebookLogin;
