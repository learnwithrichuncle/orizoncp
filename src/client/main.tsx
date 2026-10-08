import React from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sileo";
import "sileo/styles.css";
import { AppRouter } from "./router";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRouter />
    <Toaster theme="dark" position="bottom-right" />
  </React.StrictMode>
);
