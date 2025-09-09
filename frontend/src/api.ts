// src/api.ts
import axios from "axios";

// Vite automatically provides types for import.meta.env in vite/client, so no need to redeclare ImportMeta or ImportMetaEnv.

const base = (
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "http://localhost:8080"
).replace(/\/+$/, "");          // מוריד סלש-סיום

console.log("[api] baseURL =", base); // עוזר לאבחון: צריך להופיע http://localhost:8080

const api = axios.create({
  baseURL: base,
  timeout: 15000,
});

export default api;
