import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaBoxOpen, FaSignInAlt, FaFileAlt, FaShoppingCart, FaSignOutAlt, FaUsers, FaClipboardList } from "react-icons/fa";
import styled from "styled-components";
import ContentHeader from "../../components/ContentHeader";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(390px, 1fr));
  gap: 30px;
  padding: 25px;
  text-align: center;
`;



const Card = styled.div`
  background-color: ${(props) => props.theme.colors.tertiary};
  border-radius: 10px;
  margin-top: 20px;
  margin: 30px;
  padding: 35px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  svg {
    font-size: 70px;
    margin-bottom: 10px;
    color: #007bff;
  }
`;

const ControleEstoque = () => {
  const navigate = useNavigate();

  const options = [
    { icon: <FaClipboardList />, label: "Cadastrar Produto", path: "/cadastro_estoque" },
    { icon: <FaBoxOpen />, label: "Estoque", path: "/estoque" },
    { icon: <FaFileAlt />, label: "Registrar Entradas", path: "/registro-entradas" },
    { icon: <FaSignInAlt />, label: "Entradas", path: "/entradas" },
    { icon: <FaShoppingCart />, label: "Registrar Venda", path: "/vendas" },
    { icon: <FaSignOutAlt />, label: "Saídas", path: "/saidas" },
  ];

  return (

   <div>

    <ContentHeader title="Painel de Controle" lineColor="#4E41F0" >
         <h2></h2>
    </ContentHeader>

    <Container>
      {options.map((item, index) => (
        <Card key={index} onClick={() => navigate(item.path)}>
          {item.icon}
          <span>{item.label}</span>
        </Card>
      ))}
    </Container>
    </div>
  );
};

export default ControleEstoque;
