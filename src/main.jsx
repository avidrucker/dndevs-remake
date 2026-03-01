import React from "react";
import { createRoot } from "react-dom/client";
import "tachyons/css/tachyons.min.css";
import "./styles/legacy.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
