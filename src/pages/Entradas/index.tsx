import React, { useEffect, useState } from "react";
import Select from "react-select";
import styled from "styled-components";
import ContentHeader from "../../components/ContentHeader";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { StylesConfig } from "react-select";
import api from "../../api";

const Container = styled.div`
  max-width: 900px;
  margin: auto;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.tertiary};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-size: 30px;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background-color: ${(props) => props.theme.colors.warning};
  color: white;
  padding: 10px;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button<{ active?: boolean }>`
  padding: 10px 20px;
  background-color: ${(props) => (props.active ? "#4E41F0" : "#ddd")};
  color: ${(props) => (props.active ? "white" : "black")};
  border: none;
  border-radius: 5px;
  margin: 0 5px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-weight: bold;

  &:hover {
    background-color: ${(props) => (props.active ? "#3C35D2" : "#ccc")};
  }
`;

const Span = styled.span`
  margin-top: 5px;
  padding: 5px;
`;

const customStyles: StylesConfig<{ value: string; label: string }, false> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#fff",
    color: "#000",
    borderColor: state.isFocused ? "#4E41F0" : "#ccc",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(78, 65, 240, 0.5)" : "none",
    "&:hover": { borderColor: "#4E41F0" },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#fff",
    color: "#000",
  }),
};

const Entradas: React.FC = () => {
  const navigate = useNavigate();
  const [filtroMes, setFiltroMes] = useState<string>("");
  const [filtroAno, setFiltroAno] = useState<string>("");
  const [entradas, setEntradas] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 10;

  const meses = [
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  const anos = [
    { value: "2025", label: "2025" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
  ];

  const fetchEntradas = async () => {
    try {
      let endpoint = "/api/entradas";
      const params: any = { page: currentPage, size: pageSize };

      if (filtroMes && filtroAno) {
        endpoint += "/filtrar";
        params.mes = filtroMes;
        params.ano = filtroAno;
      } else if (filtroMes) {
        endpoint += "/filtrar/mes";
        params.mes = filtroMes;
      } else if (filtroAno) {
        endpoint += "/filtrar/ano";
        params.ano = filtroAno;
      }

      const response = await api.get(endpoint, { params });
      const dados = response.data;
      setEntradas(dados.content);
      setTotalPages(dados.totalPages);
    } catch (error) {
      console.error("Erro ao buscar entradas:", error);
    }
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [filtroMes, filtroAno]);

  useEffect(() => {
    fetchEntradas();
  }, [currentPage, filtroMes, filtroAno]);

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) setCurrentPage(page);
  };

  return (
    <div>
      <ContentHeader title="Entradas" lineColor="#4E41F0">
        <BackButton onClick={() => navigate("/controle_estoque")}> 
          <IoArrowBack size={16} /> Voltar
        </BackButton>
      </ContentHeader>

      <Container>
        <Title>Entradas de Produtos</Title>
        <FilterContainer>
          <Select
            options={meses}
            placeholder="Filtrar por mês"
            onChange={(option) => setFiltroMes(option?.value || "")}
            styles={customStyles}
            isClearable
          />
          <Select
            options={anos}
            placeholder="Filtrar por ano"
            onChange={(option) => setFiltroAno(option?.value || "")}
            styles={customStyles}
            isClearable
          />
        </FilterContainer>
        <Table>
          <thead>
            <tr>
              <Th>Produto</Th>
              <Th>Quantidade</Th>
              <Th>Data</Th>
            </tr>
          </thead>
          <tbody>
            {entradas.map((entrada) => (
              <tr key={entrada.id}>
                <Td>{entrada.nomeProduto}</Td>
                <Td>{entrada.quantidade}</Td>
                <Td>{entrada.data.split("-").reverse().join("/")}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
        <PaginationContainer>
          <PaginationButton
            active={currentPage > 0}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Anterior
          </PaginationButton>
          <Span>
            Página {currentPage + 1} de {totalPages}
          </Span>
          <PaginationButton
            active={currentPage + 1 < totalPages}
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

export default Entradas;
