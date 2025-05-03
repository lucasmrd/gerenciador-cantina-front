import axios from "axios";
import { API_BASE_URL } from "./config";
import { globalSignOut } from './hooks/auth';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.response.use(
  response => response,
  error => {
    // Se receber 401 (token inválido/expirado ou qualquer outro motivo)
    if (error.response?.status === 401) {
      // executa logout globalmente
      globalSignOut();
      //alert('Sua sessão expirou ou não está autorizada. Faça login novamente.');
    }
    return Promise.reject(error);
  }
);

export default api;
