import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Suppress React 19 element.ref deprecation warnings from third-party libraries (e.g. Radix UI)
if (import.meta.env.DEV) {
  const filterReact19RefWarning = (origFn: (...args: any[]) => void) => {
    return (...args: any[]) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("Accessing element.ref was removed in React 19")
      ) {
        return;
      }
      origFn.apply(console, args);
    };
  };
  console.error = filterReact19RefWarning(console.error);
  console.warn = filterReact19RefWarning(console.warn);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

