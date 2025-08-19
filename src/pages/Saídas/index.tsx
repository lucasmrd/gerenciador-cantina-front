import React, { useEffect, useState } from "react";
import Select from "react-select";
import styled from "styled-components";
import ContentHeader from "../../components/ContentHeader";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { StylesConfig } from "react-select";
import api from "../../api";
import ModalEditarSaida from "../../components/ModalEditarSaida";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Container = styled.div`
  max-width: 1000px;
  margin: auto;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.tertiary};
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-size: 32px;
  color: ${(props) => props.theme.colors.white};
`;

const HeaderButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const ClearButton = styled.button`
  position: absolute;
  right: -25px;
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.white};
  cursor: pointer;
  font-size: 18px;

  &:hover {
    color: red;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${(props) => props.theme.colors.tertiary};
`;

const Th = styled.th`
  background-color: ${(props) => props.theme.colors.warning};
  color: white;
  padding: 12px;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #444;
  color: ${(props) => props.theme.colors.white};
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

const ExportButton = styled.button`
  padding: 10px 20px;
  border-radius: 7px;
  background-color: #4e41f0;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  border: none;

  &:hover {
    background-color: #3c35d2;
  }
`;



const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  align-items: center;
`;

const Input = styled.input`
  padding: 8px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;


const Button = styled.button`
  padding: 8px 14px;
  background-color: #4e41f0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  &:hover {
    background-color: #3b33c9;
  }
`;


const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  align-items: center;
  gap: 10px;
`;

const PaginationButton = styled.button<{ active?: boolean }>`
  padding: 10px 20px;
  background-color: ${(props) => (props.active ? "#4E41F0" : "#ddd")};
  color: ${(props) => (props.active ? "white" : "black")};
  border: none;
  border-radius: 5px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-weight: bold;

  &:hover {
    background-color: ${(props) => (props.active ? "#3C35D2" : "#ccc")};
  }
`;

const Span = styled.span`
  font-weight: bold;
  color: ${(props) => props.theme.colors.white};
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

  h2 {
    margin-bottom: 1rem;
  }

  label {
    font-weight: bold;
    margin-top: 1rem;
    display: block;
  }

  input {
    width: 100%;
    padding: 8px;
    margin-top: 4px;
    margin-bottom: 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }

  button {
    padding: 8px 16px;
    background-color: #4caf50;
    border: none;
    color: white;
    border-radius: 6px;
    cursor: pointer;
  }

  button:first-child {
    background-color: #999;
  }

  ul {
    list-style: none;
    padding-left: 0;
  }
`;

const DateFilters = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  label {
    font-weight: bold;
  }

  input[type="date"] {
    padding: 6px 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
  }
`;


const customStyles: StylesConfig<{ value: string; label: string }, false> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#fff",
    borderColor: state.isFocused ? "#4E41F0" : "#ccc",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(78, 65, 240, 0.5)" : "none",
    "&:hover": { borderColor: "#4E41F0" },
  }),
  menu: (base) => ({ ...base, backgroundColor: "#fff", color: "#000" }),
};

const Saidas: React.FC = () => {
  const navigate = useNavigate();
  const [saidas, setSaidas] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 10;
  const [modalAberto, setModalAberto] = useState(false);
  const [saidaSelecionada, setSaidaSelecionada] = useState<any>(null);

  const now = new Date()

  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0]  

  const lastDay  = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0]

  const [dataInicio, setDataInicio] = useState<string>(firstDay);
  const [dataFim, setDataFim] = useState<string>(lastDay);
  const [searchName, setSearchName] = useState<string>("")

  const funcionariosOptions = [
    { value: "João", label: "João" },
    { value: "Maria", label: "Maria" },
    // ...
  ];

  const pagamentosOptions = [
    { value: "Dinheiro", label: "Dinheiro" },
    { value: "Cartão", label: "Cartão" },
    // ...
  ];

  useEffect(() => {
  setCurrentPage(0);
  }, [dataInicio, dataFim, searchName]);

  useEffect(() => {
    fetchSaidas();
  }, [currentPage, dataInicio, dataFim, searchName]);

  const fetchSaidas = async () => {
    try {      
      let endpoint = "/api/vendas"
      const params: any = { page: currentPage, size: pageSize }

      if (dataInicio && dataFim && searchName) {
        endpoint += "/filtrar/periodo-nome"
        params.dataInicio = dataInicio
        params.dataFim = dataFim
        params.nome = searchName
      }
      else if (dataInicio && dataFim) {
        endpoint += "/filtrar/periodo"
        params.dataInicio = dataInicio
        params.dataFim = dataFim
      }
      else if (searchName) {
        endpoint += "/filtrar/nome"
        params.nome = searchName
      }

      const res = await api.get(endpoint, { params })
      setSaidas(res.data.content)
      setTotalPages(res.data.totalPages)
    } catch (err) {
      console.error("Erro ao buscar saídas:", err)
    }
  }

  const handleEditarSaida = (saida: any) => {
    setSaidaSelecionada(saida);
    setModalAberto(true);
  };

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) setCurrentPage(page);
  };

const exportarParaExcel = async () => {
  try {
    let endpoint = "/api/vendas";
    const params: any = {};

    // aplica filtros, mas sem paginação
    if (dataInicio && dataFim && searchName) {
      endpoint += "/filtrar/periodo-nome";
      params.dataInicio = dataInicio;
      params.dataFim = dataFim;
      params.nome = searchName;
    } 
    else if (dataInicio && dataFim) {
      endpoint += "/filtrar/periodo";
      params.dataInicio = dataInicio;
      params.dataFim = dataFim;
    } 
    else if (searchName) {
      endpoint += "/filtrar/nome";
      params.nome = searchName;
    }

    params.page = 0;
    params.size = 9999;

    const res = await api.get(endpoint, { params });
    const todasSaidas = res.data.content; // agora vem tudo

 const dadosExcel = todasSaidas.map((saida: any) => ({
      "Funcionário": saida.funcionario,
      "Produtos": (saida.itens || [])
        .map(
          (item: any) =>
            `${item.nomeProduto} (${item.quantidade}) – R$ ${item.valor.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`
        )
        .join("\n"),
      "Pagamento": saida.pagamento,
      "Data": saida.data.split("-").reverse().join("/"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    worksheet["!cols"] = [
      { wch: 25 },
      { wch: 50 },
      { wch: 15 },
      { wch: 15 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Saídas");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([excelBuffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      }),
      `saidas_completas.xlsx`
    );
  } catch (error) {
    console.error("Erro ao exportar Excel:", error);
    alert("Não foi possível exportar todas as saídas.");
  }
};

  return (
    <div>
      <ContentHeader title="Saídas" lineColor="#4E41F0" >
        <BackButton onClick={() => navigate("/controle_estoque")}>
          <IoArrowBack size={16} /> Voltar
        </BackButton>
      </ContentHeader>
      <Container>
        <Title>Saídas de Produtos</Title>

        <Filters>
          <Input
            type="date"
            value={dataInicio}
            onChange={(e) => {
              setDataInicio(e.target.value);
              setCurrentPage(0);
            }}
            placeholder="Data início"
          />
          <Input
            type="date"
            value={dataFim}
            onChange={(e) => {
              setDataFim(e.target.value);
              setCurrentPage(0);
            }}
            placeholder="Data fim"
          />
          <Input
            type="text"
            placeholder="Funcionário..."
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
              setCurrentPage(0);
            }}
          />
          <Button onClick={exportarParaExcel}>Exportar Excel</Button>
        </Filters>

        <Table>
          <thead>
            <tr>
              <Th>Funcionário</Th>
              <Th>Produtos</Th>
              <Th>Pagamento</Th>
              <Th>Data</Th>
            </tr>
          </thead>
          <tbody>
            {saidas.map((saida) => (
              <tr key={saida.id} onClick={() => handleEditarSaida(saida)} style={{ cursor: "pointer" }}>
                <Td>{saida.funcionario}</Td>
                <Td>
                  {(saida.itens || []).map((item: any, idx: number) => (
                    <div key={idx}>
                      • {item.nomeProduto} ({item.quantidade}) - R${" "}
                      {item.valor.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </div>
                  ))}
                </Td>
                <Td>{saida.pagamento}</Td>
                <Td>{saida.data.split("-").reverse().join("/")}</Td>
              </tr>
            ))}
          </tbody>
        </Table>

        <ModalEditarSaida
          isOpen={modalAberto}
          onClose={() => setModalAberto(false)}
          dadosSaida={saidaSelecionada}
          funcionariosOptions={funcionariosOptions} // array tipo [{value: 'João', label: 'João'}, ...]
          pagamentosOptions={pagamentosOptions}   // array tipo [{value: 'Dinheiro', label: 'Dinheiro'}, ...]
          onSave={(dadosAtualizados) => {
            console.log("Dados atualizados:", dadosAtualizados);

            setModalAberto(false);

            setSaidas((prev) =>
              prev.map((saida) =>
                saida.id === dadosAtualizados.id ? { ...saida, ...dadosAtualizados } : saida
              )
            );
          }}
        />

        <PaginationContainer>
          <PaginationButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Anterior
          </PaginationButton>
          <Span>
            Página {currentPage + 1} de {totalPages}
          </Span>
          <PaginationButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage + 1 === totalPages}
          >
            Próxima
          </PaginationButton>
        </PaginationContainer>
      </Container>
    </div>
  );
};

export default Saidas;
