import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./i18n.js";
import App from "./App.jsx";
import "./index.css";
import "./styles/globals.css";

import AuthProvider from "./context/AuthContext.jsx";
import ThemeProvider from "./context/ThemeContext.jsx";
import AIProvider from "./context/AIContext.jsx";
import { AccessibilityProvider } from "./components/AccessibilityProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AccessibilityProvider>
      <ThemeProvider>
        <AuthProvider>
          <AIProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AIProvider>
        </AuthProvider>
      </ThemeProvider>
    </AccessibilityProvider>
  </React.StrictMode>
);


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("✅ Service Worker Registered"))
      .catch((err) => console.warn("⚠️ SW Registration Failed:", err));
  });
}
