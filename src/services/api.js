import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? "https://sistema-de-gerenciamento-de-notas-backend.onrender.com" 
    : "http://127.0.0.1:5000/"
});
