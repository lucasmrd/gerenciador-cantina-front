import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

interface IAuthContext {
  logged: boolean;
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logged, setLogged] = useState<boolean>(false);
  const navigate = useNavigate();

  const setAuthToken = (token: string | null) => {
    if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete api.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      setLogged(true);
    }
  }, []);

  const signIn = async (login: string, senha: string) => {
    try {
      const response = await api.post('/api/login', { login, senha });
      const token = response.data;
      console.log('Token recebido:', token);
      localStorage.setItem('token', token);
      setAuthToken(token);
      setLogged(true);
    } catch (err) {
      alert('Usuário ou senha inválidos!');
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setLogged(false);
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ logged, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): IAuthContext {
  return useContext(AuthContext);
}

export { AuthContext, AuthProvider, useAuth };
