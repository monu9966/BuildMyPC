import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { BuildProvider } from "./context/BuildContext";
import App from "./App";
import "./style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CartProvider>
      <AuthProvider>
        <BuildProvider>
          <App />
        </BuildProvider>
      </AuthProvider>
    </CartProvider>
  </BrowserRouter>,
);
