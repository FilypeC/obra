import { createRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.querySelector<HTMLElement>("#root");
if (!rootElement) throw new Error("React root element was not found.");

createRoot(rootElement).render(<App />);
