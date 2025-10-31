// src/api.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || ''; // fallback to '' for same-origin

const api = axios.create({
  baseURL: API_BASE // if empty, axios will use relative URLs
});

export default api;
