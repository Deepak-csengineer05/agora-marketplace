import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ParallaxProvider } from "react-scroll-parallax";
import App from "./App";
import { AuthProvider } from "./utils/auth";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ParallaxProvider>
          <App />
        </ParallaxProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
