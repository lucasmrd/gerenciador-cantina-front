import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { AsyncPaginate } from "react-select-async-paginate";
import ContentHeader from "../../components/ContentHeader";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import axios from "axios";
import Select from "react-select";

// Styled-components
const Container = styled.div``;

const ContainerForm = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.tertiary};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: ${(props) => props.theme.colors.white};
`;

const Label = styled.label`
  display: block;
  padding: 12px 0px;
  color: ${(props) => props.theme.colors.white};
`;

const Input = styled.input<{ alterada?: boolean }>`
  width: 100%;
  padding: 15px;
  margin-bottom: 16px;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.alterada ? "#ccc" : "#aad")};
  background-color: ${(props) => (props.alterada ? "#fff" : "#f0f8ff")};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Button = styled.button`
  width: 50%;
  padding: 12px;
  background-color: ${(props) => props.theme.colors.warning};
  color: ${(props) => props.theme.colors.white};
  border: none;
  margin: auto;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;

  &:hover {
    opacity: 0.8;
    background-color: ${(props) => props.theme.colors.danger};
  }
`;

const Button2 = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${(props) => props.theme.colors.warning};
  color: ${(props) => props.theme.colors.white};
  border: none;
  margin-top: 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;

  &:hover {
    opacity: 0.8;
    background-color: ${(props) => props.theme.colors.danger};
  }
`;

const Resumo = styled.div`
  margin-bottom: 18px;
  margin-top: 30px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RemoveButton = styled.button`
  padding: 6px 10px;
  background-color: ${(props) => props.theme.colors.danger};
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background-color: ${(props) => props.theme.colors.warning};
  }
`;

const BackButton = styled.button`
  width: 105px;
  padding: 10px;
  border-radius: 7px;
  background-color: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.white};
  font-size: 18px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    text-decoration: none;
  }
`;

const customSelectStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: "#fff",
    borderRadius: "4px",
    borderColor: "#ccc",
    padding: "3px",
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: "4px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#E44C4E" : state.isFocused ? "#F1F1F1" : "#fff",
    color: state.isSelected ? "#fff" : "#333",
    padding: "10px",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#333",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};

// Tipos
interface Funcionario {
  id: number;
  nome: string;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
}

interface ItemVenda {
  funcionarioId: number;
  nome: string;
  produtoId: number;
  quantidade: number;
  preco: number;
  subtotal: number;
}

interface Venda {
  funcionarioId: string;
  itens: ItemVenda[];
  formaPagamento: string;
}

const API_BASE = "https://controle-de-estoque-60ju.onrender.com/api";

const Vendas = () => {
  const navigate = useNavigate();
  const [venda, setVenda] = useState<Venda>({
    funcionarioId: "",
    itens: [],
    formaPagamento: "",
  });

  const [itemTemp, setItemTemp] = useState<ItemVenda | null>(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any | null>(null);
  const [quantidade, setQuantidade] = useState<number | string>("");
  const [produtoSelectKey, setProdutoSelectKey] = useState(0);

  const hoje = new Date().toISOString().split("T")[0];
  const [dataVenda, setDataVenda] = useState(hoje);
  const [dataAlterada, setDataAlterada] = useState(false);

  const adicionarItem = () => {
    if (!itemTemp || !itemTemp.produtoId || !quantidade || !itemTemp.preco) {
      alert("Por favor, selecione um produto e informe a quantidade.");
      return;
    }

    const quantidadeNum = Number(quantidade);
    const subtotal = quantidadeNum * itemTemp.preco;

    setVenda({
      ...venda,
      itens: [
        ...venda.itens,
        {
          ...itemTemp,
          quantidade: quantidadeNum,
          subtotal,
        },
      ],
    });

    setItemTemp(null);
    setProdutoSelecionado(null);
    setQuantidade("");
    setProdutoSelectKey((prev) => prev + 1);
  };

  const removerItem = (index: number) => {
    const novaLista = [...venda.itens];
    novaLista.splice(index, 1);
    setVenda({ ...venda, itens: novaLista });
  };

  const calcularTotalVenda = () => {
    return venda.itens.reduce((total, item) => total + item.subtotal, 0);
  };

  const carregarFuncionarios = async (inputValue: string, loadedOptions: any, { page }: any) => {
    const response = await axios.get(`${API_BASE}/funcionarios/buscar`, {
      params: { nome: inputValue, page, size: 10 },
    });
    const content = response.data.content;

    return {
      options: content.map((f: Funcionario) => ({
        value: f.id,
        label: f.nome,
      })),
      hasMore: !response.data.last,
      additional: { page: page + 1 },
    };
  };

  const carregarProdutos = async (inputValue: string, loadedOptions: any, { page }: any) => {
    const response = await axios.get(`${API_BASE}/produtos`, {
      params: { page, size: 20 },
    });
    const content = response.data.content;

    return {
      options: content.map((p: Produto) => ({
        value: p.id,
        label: `${p.nome} - R$${p.preco.toFixed(2)}`,
        preco: p.preco,
        nome: p.nome,
      })),
      hasMore: !response.data.last,
      additional: { page: page + 1 },
    };
  };

  const formaPagamentoOptions = [
    { value: "Desconto em folha", label: "Desconto em folha" },
    { value: "Pix", label: "Pix" },
    { value: "Débito", label: "Débito" },
    { value: "Crédito", label: "Crédito" },
  ];

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataVenda(e.target.value);
    setDataAlterada(e.target.value !== hoje);
  };

  const finalizarVenda = async () => {
    if (!venda.funcionarioId || !venda.formaPagamento || venda.itens.length === 0) {
      alert("Preencha todos os campos antes de finalizar a venda.");
      return;
    }

    const payload = {
      idFuncionario: venda.funcionarioId,
      pagamento: venda.formaPagamento,
      data: dataVenda,
      produtos: venda.itens.map((item) => ({
        idProduto: item.produtoId,
        quantidade: item.quantidade,
      })),
    };

    try {
      await axios.post(`${API_BASE}/vendas`, payload);
      alert("Venda registrada com sucesso!");
      navigate("/controle_estoque");
    } catch (error) {
      console.error("Erro ao registrar venda:", error);
      alert("Erro ao registrar venda.");
    }
  };

  return (
    <Container>
      <ContentHeader title="Registrar Venda" lineColor="#E44C4E">
        <BackButton onClick={() => navigate("/controle_estoque")}>
          <IoArrowBack size={16} /> Voltar
        </BackButton>
      </ContentHeader>
      <ContainerForm>
        <Title>Venda</Title>

        <Label>Produto:</Label>
        <AsyncPaginate
          key={produtoSelectKey}
          styles={customSelectStyles}
          loadOptions={carregarProdutos}
          defaultOptions
          additional={{ page: 0 }}
          onChange={(selectedOption: any) => {
            setProdutoSelecionado(selectedOption);
            setItemTemp((prev) => ({
              ...(prev || {}),
              produtoId: selectedOption.value,
              nome: selectedOption.nome,
              preco: selectedOption.preco,
              funcionarioId: prev?.funcionarioId || 0,
              quantidade: prev?.quantidade || 1,
              subtotal: prev?.subtotal || 0,
            }));
          }}
        />

        <Label>Quantidade:</Label>
        <Input
          type="number"
          min="1"
          value={quantidade}
          onChange={(e) => {
            const valor = e.target.value;
            setQuantidade(valor);
            setItemTemp((prev) =>
              prev ? { ...prev, quantidade: Number(valor) } : prev
            );
          }}
        />

        <ButtonContainer>
          <Button onClick={adicionarItem}>Adicionar</Button>
        </ButtonContainer>

        <Resumo>
          <h3>Resumo da Venda</h3>
          <List>
            {venda.itens.map((item, index) => (
              <ListItem key={index}>
                <span>
                  {item.nome} | {item.quantidade}x | R${(item.preco * item.quantidade).toFixed(2)}
                </span>
                <RemoveButton onClick={() => removerItem(index)}>Remover</RemoveButton>
              </ListItem>
            ))}
          </List>
          <strong>Total: R${calcularTotalVenda().toFixed(2)}</strong>
        </Resumo>

        <Label>Funcionário:</Label>
        <AsyncPaginate
          styles={customSelectStyles}
          loadOptions={carregarFuncionarios}
          defaultOptions
          additional={{ page: 0 }}
          onChange={(selectedOption: any) =>
            setVenda({ ...venda, funcionarioId: selectedOption.value })
          }
        />

        <Label>Forma de Pagamento:</Label>
        <Select
          styles={customSelectStyles}
          options={formaPagamentoOptions}
          onChange={(selectedOption: any) =>
            setVenda({ ...venda, formaPagamento: selectedOption.value })
          }
        />

        <Label>Data:</Label>
        <Input
          type="date"
          value={dataVenda}
          onChange={handleDataChange}
          alterada={dataAlterada}
        />

        <Button2 onClick={finalizarVenda}>Finalizar Venda</Button2>
      </ContainerForm>
    </Container>
  );
};

export default Vendas;
