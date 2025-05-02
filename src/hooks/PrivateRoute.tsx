import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth';

interface Props {
  children: JSX.Element;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const { logged } = useAuth();

  if (!logged) {
    return <Navigate to="/login" replace />;
  }

  return children
};

export default PrivateRoute;