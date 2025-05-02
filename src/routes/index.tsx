import React from "react";
import { useAuth } from '../hooks/auth';

import App from "./app.routes";
import Auth from './auth.routes';

const Routes: React.FC = () => {
  const { logged } = useAuth();

  return logged ? <App /> : <Auth />;
};

export default Routes;
