import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import logoImg from "../../assets/iconcantina.png";  

import Input from '../../components/input';
import Button from "../../components/button"; 

import { useAuth } from "../../hooks/auth";

import { Container, Logo, Form, FormTitle } from "./styles";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { signIn, logged } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  useEffect(() => {
    if (logged) {
      navigate('/'); // Redireciona para a página principal após login
    }
  }, [logged, navigate]);

  return (
    <Container>
      <Logo>
        <img src={logoImg} alt="Minha carteira" />
        <h2>Cantina</h2>
      </Logo>

      <Form onSubmit={handleSubmit}>
        <FormTitle>Entrar</FormTitle>

        <Input 
          type="text"
          placeholder="E-mail"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Senha"
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit">Acessar</Button>
      </Form>
    </Container>
  );
};

export default SignIn;
