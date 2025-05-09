import axios from "axios";
import { API_BASE_URL } from "./config";
import { globalSignOut } from './hooks/auth';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const api = axios.create({
  baseURL: API_BASE_URL,
});
/*
api.interceptors.response.use(
  response => response,
  error => {
    // Se receber 401 (token inválido/expirado ou qualquer outro motivo)
    if (error.response?.status === 401) {
      // executa logout globalmente
      globalSignOut();
      alert('Sua sessão expirou ou não está autorizada. Faça login novamente.');
    }
    return Promise.reject(error);
  }
);
*/
NProgress.configure({
  minimum: 0.2,      // começa já com 20% de preenchimento
  trickleSpeed: 100, // gota a gota a cada 100 ms
  showSpinner: true
})

api.interceptors.request.use(config => {
  NProgress.start()
  return config
})

api.interceptors.response.use(
  res => {
    NProgress.done()
    return res
  },
  err => {
    NProgress.done()
    return Promise.reject(err)
  }
)


export default api;
