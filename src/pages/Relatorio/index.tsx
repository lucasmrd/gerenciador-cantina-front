import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ContentHeader from "../../components/ContentHeader";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Container = styled.div`
  padding: 20px;
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
`;

const Input = styled.input`
  padding: 8px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  padding: 8px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const TableContainer = styled.div`
  margin-top: 20px;
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #ccc;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background-color: #4e41f0;
  color: white;
  padding: 10px;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #ccc;
  padding: 10px;
`;

const Pagination = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 14px;
  background-color: #4e41f0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
`;

type RelatorioFuncionario = {
  idFuncionario: string;
  nomeFuncionario: string;
  valorTotalGasto: number;
};

const Relatorio: React.FC = () => {
  const navigate = useNavigate();
  const [relatorio, setRelatorio] = useState<RelatorioFuncionario[]>([]);
  const [search, setSearch] = useState("");
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [ano, setAno] = useState(new Date().getFullYear());
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://controle-de-estoque-60ju.onrender.com/api/funcionarios/gastos-funcionarios", {
          params: {
            mes,
            ano,
            page: currentPage,
            size: 10,
          },
        });

        setRelatorio(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [mes, ano, currentPage]);

  return (
    <Container>
      <ContentHeader title="Relatório de Gastos por Funcionário" lineColor="#4E41F0">
        <BackButton onClick={() => navigate("/controle_estoque")}>
          <IoArrowBack size={16} /> Voltar
        </BackButton>
      </ContentHeader>

      <Filters>
        <Select value={mes} onChange={(e) => setMes(Number(e.target.value))}>
          {[...Array(12)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1} - {new Date(0, index).toLocaleString("pt-BR", { month: "long" })}
            </option>
          ))}
        </Select>

        <Select value={ano} onChange={(e) => setAno(Number(e.target.value))}>
          {[...Array(5)].map((_, index) => {
            const y = new Date().getFullYear() - index;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </Select>

        <Input
          type="text"
          placeholder="Pesquisar por nome..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(0);
          }}
        />
      </Filters>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Nome</Th>
              <Th>Valor Total Gasto (R$)</Th>
            </tr>
          </thead>
          <tbody>
            {relatorio
              .filter((item) =>
                item.nomeFuncionario.toLowerCase().includes(search.toLowerCase())
              )
              .map((item) => (
                <tr key={item.idFuncionario}>
                  <Td>{item.nomeFuncionario}</Td>
                  <Td>{item.valorTotalGasto.toFixed(2).replace(".", ",")}</Td>
                </tr>
              ))}
          </tbody>
        </Table>
      </TableContainer>

      <Pagination>
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          Anterior
        </Button>
        <span>
          Página {currentPage + 1} de {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={currentPage === totalPages - 1}
        >
          Próxima
        </Button>
      </Pagination>
    </Container>
  );
};

export default Relatorio;
