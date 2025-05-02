import React, { useState, useEffect } from "react";
import ContentHeader from "../../components/ContentHeader";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import api from "../../api";

const Container = styled.div`
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #4e41f0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
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

const Th = styled.th<{ width?: string }>`
  background-color: #4e41f0;
  color: white;
  padding: 10px;
  text-align: left;
  white-space: nowrap;
  width: ${(props) => props.width || "auto"};
`;

const Td = styled.td<{ width?: string }>`
  border: 1px solid #ccc;
  padding: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: ${(props) => props.width || "auto"};
`;

const Pagination = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const ActionButton = styled.button`
  margin-left: 15px;
  padding: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

  &:first-child {
    background-color: #f0ad4e;
    color: white;
  }

  &:last-child {
    background-color: #d9534f;
    color: white;
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

const CadastroFuncionario: React.FC = () => {
  const navigate = useNavigate();
  const [funcionarios, setFuncionarios] = useState<{ id: string; nome: string }[]>([]);
  const [nome, setNome] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [editando, setEditando] = useState<string | null>(null);

  useEffect(() => {
    if (search.trim()) {
      fetchFuncionariosFiltrados();
    } else {
      fetchFuncionarios();
    }
  }, [search, currentPage]);

  const fetchFuncionarios = async () => {
    try {
      const response = await api.get("/api/funcionarios", { params: { page: currentPage, size: 10 } });
      const dados = response.data;
      setFuncionarios(Array.isArray(dados.content) ? dados.content : []);
      setTotalPages(dados.totalPages || 1);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
      setFuncionarios([]);
      setTotalPages(1);
    }
  };

  const fetchFuncionariosFiltrados = async () => {
    try {
      const response = await api.get("/api/funcionarios/buscar", { params: { nome: search, page: currentPage, size: 10 } });
      const dados = response.data;
      setFuncionarios(Array.isArray(dados.content) ? dados.content : []);
      setTotalPages(dados.totalPages || 1);
    } catch (error) {
      console.error("Erro ao buscar funcionários filtrados:", error);
      setFuncionarios([]);
      setTotalPages(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    try {
      if (editando) {
        await api.put(`/api/funcionarios/${editando}`, { nome });
        setEditando(null);
      } else {
        await api.post("/api/funcionarios", { nome });
      }
      fetchFuncionarios();
      setNome("");
    } catch (error) {
      console.error("Erro ao cadastrar/editar funcionário:", error);
    }
  };

  const handleEdit = (id: string) => {
    const funcionario = funcionarios.find((func) => func.id === id);
    if (funcionario) {
      setNome(funcionario.nome);
      setEditando(id);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/funcionarios/${id}`);
      fetchFuncionarios();
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error);
    }
  };

  return (
    <Container>
      <ContentHeader title="Funcionários" lineColor="#4E41F0">
        <BackButton onClick={() => navigate("/controle_estoque")}> 
          <IoArrowBack size={16} /> Voltar
        </BackButton>
      </ContentHeader>

      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <Button type="submit">{editando ? "Salvar Edição" : "Cadastrar"}</Button>
      </Form>

      <Input
        type="text"
        placeholder="Pesquisar funcionário..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setCurrentPage(0);} }
        style={{ marginTop: "20px" }}
      />

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th width="600px">Nome</Th>
              <Th width="200px">Ações</Th>
            </tr>
          </thead>
          <tbody>
            {funcionarios.map((func) => (
              <tr key={func.id}>
                <Td width="800px">{func.nome}</Td>
                <Td width="200px">
                  <ActionButton onClick={() => handleEdit(func.id)}>Editar</ActionButton>
                  <ActionButton onClick={() => { if(window.confirm("Deseja realmente excluir esse funcionário?")) handleDelete(func.id); }}>Excluir</ActionButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      <Pagination>
        <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))} disabled={currentPage === 0}>Anterior</Button>
        <span>Página {currentPage + 1} de {totalPages}</span>
        <Button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))} disabled={currentPage === totalPages - 1}>Próxima</Button>
      </Pagination>
    </Container>
  );
};

export default CadastroFuncionario;
