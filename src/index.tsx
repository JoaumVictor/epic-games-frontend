import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { CartProvider } from "./context/cart";
import { CreditCardProvider } from "./context/creditCard";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <CreditCardProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </CreditCardProvider>
  </React.StrictMode>
);
