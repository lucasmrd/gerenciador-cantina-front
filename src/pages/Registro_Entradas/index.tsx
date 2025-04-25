import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import ContentHeader from "../../components/ContentHeader";
import axios from 'axios';

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  max-width: 800px;
  padding: 20px;
`;

const ContainerForm = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.tertiary};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: ${(props) => props.theme.colors.white};
`;

const SelectContainer = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 20px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: ${(props) => props.theme.colors.warning};
  color: ${(props) => props.theme.colors.white};
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const BackButton = styled.button`
  width: 100px;
  padding: 10px;
  border-radius: 7px;
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.white};
  font-size: 18px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    text-decoration: none;
  }
`;

interface Produto {
  id: string;
  nome: string;
}

const RegistroEntradas: React.FC = () => {
  const navigate = useNavigate(); 
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [quantidade, setQuantidade] = useState<number>(0);
  const [data, setData] = useState<string>('');

  useEffect(() => {
    axios.get('https://controle-de-estoque-60ju.onrender.com/api/produtos?page=0&size=10')
      .then(response => {
        setProdutos(response.data.content);
      })
      .catch(error => {
        console.error("Erro ao buscar produtos:", error);
        alert("Erro ao carregar a lista de produtos.");
      });
  }, []);

  const handleAddEntrada = async () => {
    if (produtoSelecionado && quantidade > 0 && data) {
      const entradaData = {
        idProduto: produtoSelecionado.id,
        quantidade,
        data
      };

      try {
        await axios.post("https://controle-de-estoque-60ju.onrender.com/api/entradas", entradaData, {
          headers: { "Content-Type": "application/json" }
        });
        alert("Entrada registrada com sucesso!");
      } catch (error) {
        console.error("Erro ao registrar entrada:", error);
        alert("Erro ao registrar entrada.");
      }
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  return (
    <div>
      <ContentHeader title="Registrar Entrada" lineColor="#4E41F0">
        <BackButton onClick={() => navigate("/controle_estoque")}>
          <IoArrowBack size={16}/> Voltar
        </BackButton>
      </ContentHeader>

      <Container>
        <ContainerForm>
          <Title>Entrada</Title>

          <SelectContainer>
            <Select
              options={produtos.map(produto => ({
                value: produto.id,
                label: produto.nome
              }))}
              onChange={(selected) => setProdutoSelecionado(produtos.find(prod => prod.id === selected?.value) || null)}
              placeholder="Selecione o Produto"
              styles={{
                option: (provided, state) => ({
                  ...provided,
                  color: 'black', 
                  backgroundColor: state.isFocused ? '#eee' : 'white' 
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: 'black' 
                })
              }}
        
            />
          </SelectContainer>

          <Input
            type="number"
            placeholder="Quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
          />

          <Input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />

          <Button onClick={handleAddEntrada}>Registrar Entrada</Button>
        </ContainerForm>
      </Container>
    </div>
  );
};

export default RegistroEntradas;
