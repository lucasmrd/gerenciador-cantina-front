import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { AsyncPaginate } from 'react-select-async-paginate';
import type { GroupBase, OptionsOrGroups } from 'react-select';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import ContentHeader from '../../components/ContentHeader';
import api from '../../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Styled-components
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
  background-color: ${props => props.theme.colors.tertiary};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: ${props => props.theme.colors.white};
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
  background-color: ${props => props.theme.colors.warning};
  color: ${props => props.theme.colors.white};
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

interface ProdutoOption {
  value: string;
  label: string;
}

interface Meta {
  page: number;
}

interface Entrada {
  idProduto: string;
  quantidade: number;
  data: string;
}

const customSelectStyles: Record<string, any> = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: '8px',
    padding: '3px',
    marginBottom: '16px',
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: '4px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#E44C4E'
      : state.isFocused
      ? '#F1F1F1'
      : '#fff',
    color: state.isSelected ? '#fff' : '#333',
    padding: '10px',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#333',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
};

const RegistroEntradas: React.FC = () => {
  const navigate = useNavigate();
  const [produtoOption, setProdutoOption] = useState<ProdutoOption | null>(null);
  const [quantidade, setQuantidade] = useState('');
  const [data, setData] = useState(getDataHoje());

  const lastSearch = useRef<string>('');

  function getDataHoje(): string {
    const hoje = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
    );
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  const loadProdutos = async (
    inputValue: string,
    _loadedOptions: OptionsOrGroups<ProdutoOption, GroupBase<ProdutoOption>>,
    additional: Meta = { page: 0 }
  ): Promise<{ options: ProdutoOption[]; hasMore: boolean; additional: Meta }> => {
    let page = additional.page;

    // resetar página ao mudar a busca
    if (inputValue !== lastSearch.current) {
      page = 0;
      lastSearch.current = inputValue;
    }

    const params: any = { page, size: 20 };
    if (inputValue) {
      params.nome = inputValue;
    }

    const response = await api.get('/api/produtos', { params });
    const { content, last } = response.data;

    return {
      options: content.map((p: any) => ({ value: p.id, label: p.nome })),
      hasMore: !last,
      additional: { page: page + 1 },
    };
  };

  const handleAddEntrada = async () => {
    const qNum = Number(quantidade);
    if (!produtoOption || qNum <= 0 || !data) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await api.post('/api/entradas', {
        idProduto: produtoOption.value,
        quantidade: qNum,
        data,
      });
      toast.success('Entrada registrada com sucesso!');
      setProdutoOption(null);
      setQuantidade('');
      setData(getDataHoje());
      lastSearch.current = ''; // limpa busca
    } catch {
      toast.error('Erro ao registrar entrada!');
    }
  };

  return (
    <>
      <ContentHeader title="Registrar Entrada" lineColor="#4E41F0">
        <BackButton onClick={() => navigate('/controle_estoque')}>
          <IoArrowBack size={16} /> Voltar
        </BackButton>
      </ContentHeader>

      <Container>
        <ContainerForm>
          <Title>Entrada</Title>

          <AsyncPaginate
            styles={customSelectStyles}
            loadOptions={loadProdutos}
            defaultOptions
            additional={{ page: 0 }}
            value={produtoOption}
            onChange={opt => setProdutoOption(opt)}
            placeholder="Selecione o Produto"
          />

          <Input
            type="number"
            placeholder="Quantidade"
            value={quantidade}
            onChange={e => setQuantidade(e.target.value)}
          />
          <Input
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
          />
          <Button onClick={handleAddEntrada}>Registrar Entrada</Button>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </ContainerForm>
      </Container>
    </>
  );
};

export default RegistroEntradas;
