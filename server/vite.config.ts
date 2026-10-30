import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { employeeApi } from "../backend/api";

export default defineConfig({
  root: fileURLToPath(new URL("../frontend", import.meta.url)),
  plugins: [react(), employeeApi()],
});
