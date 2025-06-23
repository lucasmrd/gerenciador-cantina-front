import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ContentHeader from "../../components/ContentHeader";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const Container = styled.div`
  padding: 20px;
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
  align-items: center;
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

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
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
  const [apenasFolha, setApenasFolha] = useState(false);
  const anosFixos = [2024, 2025, 2026, 2027];
  const [dataInicio, setDataInicio] = useState<string>("");  
  const [dataFim, setDataFim] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
// escolhe endpoint: período ou mês/ano
      let endpointBase = "/api/funcionarios/gastos-funcionarios";
      
      if (dataInicio && dataFim) {
        endpointBase += apenasFolha
        ? "/folha/periodo"
        : "/periodo";
      } else {
        endpointBase += apenasFolha
        ? "/folha"
        : "";
      }
      const params: any = { page: currentPage, size: 10 };
      if (dataInicio && dataFim) {
        params.dataInicio = dataInicio;
        params.dataFim = dataFim;
      } else {
        params.mes = mes;
        params.ano = ano;
      }
      
      const response = await api.get(endpointBase, { params });

      const dados = response.data;
      setRelatorio(dados.content);
      setTotalPages(dados.totalPages);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [mes, ano, dataInicio, dataFim, currentPage, apenasFolha]);

  return (
    <Container>
      <ContentHeader title="Relatório de Gastos Mensal" lineColor="#4E41F0">
        <BackButton onClick={() => navigate("/controle_estoque")}>
          <IoArrowBack size={16} /> Voltar
        </BackButton>
      </ContentHeader>

      <Filters>
        {/* <Select
          value={mes}
          onChange={(e) => {
            setMes(Number(e.target.value));
            setCurrentPage(0);
          }}
        >
          
          {[...Array(12)].map((_, index) => {
            // obtém o nome do mês e capitaliza só a primeira letra
            const nomeMes = new Date(0, index)
            .toLocaleString("pt-BR", { month: "long" });
            const nomeMesCapitalizado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

            return (
            <option key={index + 1} value={index + 1}>
            {nomeMesCapitalizado}
            </option>
          );
        })}
        </Select> */}
        
        {/* <Select
          value={ano}
          onChange={(e) => {
            setAno(Number(e.target.value));
            setCurrentPage(0);
          }}
>
          {anosFixos.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Select> */}
        <Input
          type="date"
          value={dataInicio}
          onChange={e => { setDataInicio(e.target.value); setCurrentPage(0); }}
          placeholder="Data início"
        />
        <Input
          type="date"
          value={dataFim}
          onChange={e => { setDataFim(e.target.value); setCurrentPage(0); }}
          placeholder="Data fim"
        />
        <Input
          type="text"
          placeholder="Pesquisar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <CheckboxLabel>
          <input
            type="checkbox"
            checked={apenasFolha}
            onChange={() => {
              setApenasFolha((prev) => !prev);
              setCurrentPage(0);
            }}
          />
          Apenas “Desconto em folha”
        </CheckboxLabel>
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
                  <Td>
                    {item.valorTotalGasto.toFixed(2).replace(".", ",")}
                  </Td>
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
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
          }
          disabled={currentPage === totalPages - 1}
        >
          Próxima
        </Button>
      </Pagination>
    </Container>
  );
};

export default Relatorio;
