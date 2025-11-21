import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReactLenis } from "lenis/react"; // <--- NEW IMPORT PATH
import "lenis/dist/lenis.css"; // <--- ESSENTIAL CSS FOR SCROLLING
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Wrap your App with ReactLenis */}
    <ReactLenis root>
      <App />
    </ReactLenis>
  </StrictMode>
);
