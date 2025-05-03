import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface IAuthContext {
  logged: boolean;
  userName: string | null;
  signIn(login: string, senha: string): Promise<void>;
  signOut(): void;
}

interface ITokenPayload {
  exp: number;
  nome: string;
}

let externalSignOut: () => void = () => {};

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logged, setLogged] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  const setAuthToken = (token: string | null) => {
    if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete api.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    externalSignOut = signOut;
    return () => { externalSignOut = () => {}; };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setAuthToken(token);
    setLogged(true);
    /*
    try {
      const { exp, nome } = jwtDecode<ITokenPayload>(token);
      setUserName(nome);

      const expiresAt = exp * 1000;
      const now = Date.now();
      const timeout = expiresAt - now;

      if (timeout <= 0) {
        // Token já expirado
        signOut();
      } else {
        const timer = setTimeout(() => {
          alert('Sua sessão expirou. Você será deslogado.');
          signOut();
        }, timeout);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.error('Erro ao decodificar o token:', e);
      signOut();
    }
      */
  }, []);

  const signIn = async (login: string, senha: string) => {
    try {
      const response = await api.post('/api/login', { login, senha });
      const token = response.data;
      localStorage.setItem('token', token);
      setAuthToken(token);
      setLogged(true);

      const { nome, exp } = jwtDecode<ITokenPayload>(token);
      setUserName(nome);
      /*
      const expiresAt = exp * 1000;
      const now = Date.now();
      const timeout = expiresAt - now;
      setTimeout(() => {
        alert('Sua sessão expirou. Você será deslogado.');
        signOut();
      }, timeout);*/
    } catch (err) {
      alert('Usuário ou senha inválidos!');
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUserName(null);
    setLogged(false);
    navigate('/', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ logged, userName, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): IAuthContext {
  return useContext(AuthContext);
}

export function globalSignOut() {
  externalSignOut();
}

export { AuthContext, AuthProvider, useAuth };
