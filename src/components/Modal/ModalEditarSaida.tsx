import React, { useState, useEffect } from "react";
import styled from "styled-components";
import api from "../../api";

interface Option {
  value: string;
  label: string;
}

interface ModalEditarSaidaProps {
  isOpen: boolean;
  onClose: () => void;
  dadosSaida: {
    id: string;
    funcionario: string;
    pagamento: string;
    data: string;
    itens: {
      idProduto: string;
      nomeProduto: string;
      quantidade: number;
    }[];
  } | null;
  onSave: (dadosAtualizados: any) => void;
  funcionariosOptions: Option[];
  pagamentosOptions: Option[];
}

const ModalEditarSaida: React.FC<ModalEditarSaidaProps> = ({
  isOpen,
  onClose,
  dadosSaida,
  onSave,
  funcionariosOptions,
  pagamentosOptions,
}) => {
  const [funcionario, setFuncionario] = useState("");
  const [itens, setItens] = useState<
    { idProduto: string; nomeProduto: string; quantidade: number }[]
  >([]);
  const [pagamento, setPagamento] = useState("");
  const [data, setData] = useState("");

  useEffect(() => {
    if (dadosSaida) {
      setFuncionario(dadosSaida.funcionario);
      setPagamento(dadosSaida.pagamento);
      setData(dadosSaida.data.slice(0, 10));
      setItens(dadosSaida.itens);
    }
  }, [dadosSaida]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!dadosSaida) return;

    try {
      const payload = {
        idFuncionario: funcionario, // substitua por ID real se necessário
        pagamento,
        data,
        produtos: itens.map((item) => ({
          idProduto: item.idProduto,
          quantidade: item.quantidade,
        })),
      };

      const res = await api.put(`/api/vendas/${dadosSaida.id}`, payload);
      onSave(res.data);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar venda:", error);
      alert("Erro ao atualizar a venda.");
    }
  };

  return (
    <Overlay>
      <ModalContainer>
        <Header>
          <h2>Editar Saída</h2>
          <CloseButton onClick={onClose} aria-label="Fechar modal">
            &times;
          </CloseButton>
        </Header>

        <Form>
          <Label>Funcionário</Label>
          <SelectStyled
            value={funcionario}
            onChange={(e) => setFuncionario(e.target.value)}
          >
            <option value="" disabled>
              Selecione um funcionário
            </option>
            {funcionariosOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </SelectStyled>

          <Label>Produtos</Label>
          {itens.map((item, index) => (
            <div
              key={index}
              style={{ display: "flex", gap: "10px", alignItems: "center" }}
            >
              <SelectStyled
                value={item.idProduto}
                onChange={(e) => {
                  const novosItens = [...itens];
                  const idSelecionado = e.target.value;
                  const nomeSelecionado =
                    e.target.options[e.target.selectedIndex].text;
                  novosItens[index].idProduto = idSelecionado;
                  novosItens[index].nomeProduto = nomeSelecionado;
                  setItens(novosItens);
                }}
              >
                <option value="" disabled>
                  Selecione o produto
                </option>
                {/* TODO: Substituir pela lista real de produtos do backend */}
                <option value="uuid-coca">COCA CAÇULINHA</option>
                <option value="uuid-fanta">FANTA UVA</option>
              </SelectStyled>

              <Input
                type="number"
                min={1}
                value={item.quantidade}
                onChange={(e) => {
                  const novosItens = [...itens];
                  novosItens[index].quantidade = parseInt(e.target.value);
                  setItens(novosItens);
                }}
              />
            </div>
          ))}

          <Label>Pagamento</Label>
          <SelectStyled
            value={pagamento}
            onChange={(e) => setPagamento(e.target.value)}
          >
            <option value="" disabled>
              Selecione o pagamento
            </option>
            {pagamentosOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </SelectStyled>

          <Label>Data</Label>
          <Input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </Form>

        <Footer>
          <ButtonCancel onClick={onClose}>Cancelar</ButtonCancel>
          <ButtonSave onClick={handleSave}>Salvar</ButtonSave>
        </Footer>
      </ModalContainer>
    </Overlay>
  );
};

export default ModalEditarSaida;

/* Styled Components */
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: ${(props) => props.theme.colors.tertiary};
  border-radius: 8px;
  width: 430px;
  max-width: 90%;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  h2 {
    margin: 0;
    font-size: 1.4rem;
    color: ${(props) => props.theme.colors.white};
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  color: ${(props) => props.theme.colors.white};
  &:hover {
    color: #e74c3c;
  }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 4px;
  color: ${(props) => props.theme.colors.white};
`;

const SelectStyled = styled.select`
  padding: 8px 10px;
  font-size: 1rem;
  border-radius: 4px;
  border: 1.5px solid ${(props) => props.theme.colors.border};
  background: ${(props) => props.theme.colors.inputBackground};
  color: ${(props) => props.theme.colors.inputText};
  transition: border-color 0.2s;
  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    outline: none;
  }
`;

const Input = styled.input`
  padding: 8px 10px;
  font-size: 1rem;
  border-radius: 4px;
  border: 1.5px solid ${(props) => props.theme.colors.border};
  background: ${(props) => props.theme.colors.inputBackground};
  color: ${(props) => props.theme.colors.inputText};
  transition: border-color 0.2s;
  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    outline: none;
  }
`;

const Footer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ButtonCancel = styled.button`
  background: ${(props) => props.theme.colors.warning};
  color: ${(props) => props.theme.colors.white};
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    background: ${(props) => props.theme.colors.cancelHover};
  }
`;

const ButtonSave = styled.button`
  background: ${(props) => props.theme.colors.info};
  color: ${(props) => props.theme.colors.white};
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    background: ${(props) => props.theme.colors.successHover};
  }
`;
