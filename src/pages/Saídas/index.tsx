import React, { useEffect, useState } from "react";
import Select from "react-select";
import styled from "styled-components";
import ContentHeader from "../../components/ContentHeader";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { StylesConfig } from "react-select";
import api from "../../api";

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
  const [filtroMes, setFiltroMes] = useState<string>("");
  const [filtroAno, setFiltroAno] = useState<string>("");
  const [saidas, setSaidas] = useState<any[]>([]);
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

  useEffect(() => {
    setCurrentPage(0);
  }, [filtroMes, filtroAno]);

  useEffect(() => {
    fetchSaidas();
  }, [currentPage, filtroMes, filtroAno]);

  const fetchSaidas = async () => {
    try {
      let endpoint = "/api/vendas";
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
      setSaidas(dados.content);
      setTotalPages(dados.totalPages);
    } catch (error) {
      console.error("Erro ao buscar saídas:", error);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) setCurrentPage(page);
  };

  const exportarParaExcel = async () => {
    try {
      let todasSaidas: any[] = [];
      let pagina = 0;
      let totalPaginasExport = 1;
      const sizeExport = 1000;

      while (pagina < totalPaginasExport) {
        let endpoint = "/api/vendas";
        const params: any = { page: pagina, size: sizeExport };

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
        todasSaidas = todasSaidas.concat(dados.content);
        totalPaginasExport = dados.totalPages;
        pagina++;
      }

      const dadosExcel = todasSaidas.map((saida) => ({
        "Funcionário": saida.funcionario,
        "Produtos": (saida.itens || [])
          .map(
            (item: any) =>
              `${item.nomeProduto} (${item.quantidade}) - R$ ${item.valor.toFixed(
                2
              )}`
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
      XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório Saídas");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
        cellStyles: true,
      });

      const blob = new Blob([excelBuffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });

      saveAs(blob, `relatorio_saidas_${new Date().toISOString()}.xlsx`);
    } catch (error) {
      console.error("Erro ao exportar para Excel:", error);
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

<FilterContainer>
  <div style={{ display: "flex", gap: "10px" }}>
    <FilterWrapper>
      <Select
        options={meses}
        placeholder="Filtrar por mês"
        value={meses.find((m) => m.value === filtroMes) || null}
        onChange={(opt) => setFiltroMes(opt?.value || "")}
        styles={customStyles}
      />
      {filtroMes && (
        <ClearButton onClick={() => setFiltroMes("")}>
          <AiOutlineClose />
        </ClearButton>
      )}
    </FilterWrapper>

    <FilterWrapper>
      <Select
        options={anos}
        placeholder="Filtrar por ano"
        value={anos.find((a) => a.value === filtroAno) || null}
        onChange={(opt) => setFiltroAno(opt?.value || "")}
        styles={customStyles}
      />
      {filtroAno && (
        <ClearButton onClick={() => setFiltroAno("")}>
          <AiOutlineClose />
        </ClearButton>
      )}
    </FilterWrapper>
  </div>

  <ExportButton onClick={exportarParaExcel}>
    Exportar Excel
  </ExportButton>
</FilterContainer>


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
              <tr key={saida.id}>
                <Td>{saida.funcionario}</Td>
                <Td>
                  {(saida.itens || []).map((item: any, idx: number) => (
                    <div key={idx}>
                      • {item.nomeProduto} ({item.quantidade}) - R${" "}
                      {item.valor.toFixed(2)}
                    </div>
                  ))}
                </Td>
                <Td>{saida.pagamento}</Td>
                <Td>{saida.data.split("-").reverse().join("/")}</Td>
              </tr>
            ))}
          </tbody>
        </Table>

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
