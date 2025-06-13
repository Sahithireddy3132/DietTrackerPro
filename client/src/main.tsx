import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

// Add Inter font
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

// Add Font Awesome
const fontAwesome = document.createElement('script');
fontAwesome.src = 'https://kit.fontawesome.com/a076d05399.js';
fontAwesome.crossOrigin = 'anonymous';
document.head.appendChild(fontAwesome);

createRoot(root).render(<App />);
