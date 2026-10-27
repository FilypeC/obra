import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { employeeApi } from "./backend/api";

export default defineConfig({
  root: fileURLToPath(new URL("./frontend", import.meta.url)),
  plugins: [employeeApi()],
});
