import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ContentHeader from "../../components/ContentHeader";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
`

const ButtonExport = styled.button`
  padding: 10px 20px;
  background-color: #4e41f0;
  color: white;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  font-weight: bold;
  margin-left: 15px;

  &:hover {
    background-color: #3c35d2;
  }
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
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [apenasFolha, setApenasFolha] = useState(false);
  const [dataInicio, setDataInicio] = useState<string>("");  
  const [dataFim, setDataFim] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let endpointBase = "/api/funcionarios/gastos-funcionarios";
        if (dataInicio && dataFim) {
          endpointBase += apenasFolha ? "/folha/periodo" : "/periodo";
        } else {
          endpointBase += apenasFolha ? "/folha" : "";
        }

        const params: any = { page: currentPage, size: 10 };
        if (dataInicio && dataFim) {
          params.dataInicio = dataInicio;
          params.dataFim = dataFim;
        } else {
          const now = new Date();
          params.mes = now.getMonth() + 1;
          params.ano = now.getFullYear();
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
  }, [dataInicio, dataFim, currentPage, apenasFolha]);

  const exportarParaExcel = async () => {
    try {
      let endpoint = "/api/funcionarios/gastos-funcionarios";
      if (dataInicio && dataFim) {
        endpoint += apenasFolha ? "/folha/periodo" : "/periodo";
      } else {
        endpoint += apenasFolha ? "/folha" : "";
      }

      const params: any = { size: 1000 };
      if (dataInicio && dataFim) {
        params.dataInicio = dataInicio;
        params.dataFim = dataFim;
      } else {
        const now = new Date();
        params.mes = now.getMonth() + 1;
        params.ano = now.getFullYear();
      }

      let todosDados: RelatorioFuncionario[] = [];
      let pagina = 0;
      let totalPaginas = 1;

      while (pagina < totalPaginas) {
        const response = await api.get(endpoint, {
          params: { ...params, page: pagina },
        });
        const dados = response.data;
        todosDados = todosDados.concat(dados.content);
        totalPaginas = dados.totalPages;
        pagina++;
      }

      const dadosFiltrados = todosDados.filter((item) =>
        item.nomeFuncionario.toLowerCase().includes(search.toLowerCase())
      );

      const dadosParaExcel = dadosFiltrados.map((item) => ({
        "Nome do Funcionário": item.nomeFuncionario,
        "Valor Total Gasto (R$)": item.valorTotalGasto,
      }));

      const worksheet = XLSX.utils.json_to_sheet(dadosParaExcel);
      worksheet["!cols"] = [{ wch: 30 }, { wch: 20 }];

      for (let i = 2; i <= dadosParaExcel.length + 1; i++) {
        const cellAddress = `B${i}`;
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].t = "n";
          worksheet[cellAddress].z = 'R$#,##0.00';
        }
      }

      const range = XLSX.utils.decode_range(worksheet["!ref"]!);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4E41F0" } },
          alignment: { horizontal: "center" },
        };
      }

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
        cellStyles: true,
      });

      const blob = new Blob([excelBuffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });

      const nomeArquivo = dataInicio && dataFim
        ? `relatorio_${dataInicio}_a_${dataFim}.xlsx`
        : `relatorio_mes_atual.xlsx`;

      saveAs(blob, nomeArquivo);
    } catch (error) {
      console.error("Erro ao exportar:", error);
      alert("Erro ao exportar para Excel.");
    }
  };

  return (
    <Container>
      <ContentHeader title="Relatório de Gastos Mensal" lineColor="#4E41F0">
        <BackButton onClick={() => navigate("/controle_estoque")}>
          <IoArrowBack size={16} /> Voltar
        </BackButton>
      </ContentHeader>

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

        <Button onClick={exportarParaExcel}>Exportar Excel</Button>
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
