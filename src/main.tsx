import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { installInstagramLinks } from "./lib/instagram";

installInstagramLinks();

createRoot(document.getElementById("root")!).render(<App />);
