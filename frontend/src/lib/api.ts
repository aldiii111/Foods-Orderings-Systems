import axios from "axios";

// Membuat instance axios dengan konfigurasi dasar
const api = axios.create({
  baseURL: "http://localhost:5432/food_ordering",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
