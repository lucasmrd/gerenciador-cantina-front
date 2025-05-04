import React, { useState, useEffect } from "react";
import ContentHeader from "../../components/ContentHeader";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import api from "../../api";

interface Product {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  quantidade: number;
}

const Select = styled.select`
  padding: 4px 8px;
  font-size: 14px;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  margin-right: 30px;
  cursor: pointer;
  transition: border-color 0.3s ease;
  height: 27px;
  width: 120px;
  margin-left: auto;
`;

const Button = styled.button<{ variant: "edit" | "save" | "delete" | "cancel" }>`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background-color: ${({ variant }) =>
    variant === "edit" ? "#F7931B" : variant === "save" ? "#4CAF50" : variant === "cancel" ? "#E44C4E" : "#E44C4E"};
  color: #fff;
  &:hover {
    opacity: 0.9;
  }
`;

const ProductList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 70px;
  padding: 10px;
  button {
    margin-top: 10px;
    padding: 5px;
  }
`;

const EditForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: ${({ theme }) => theme.colors.tertiary};
  padding: 15px;
  border-radius: 10px;
`;

const StyledInput = styled.input`
  padding: 9px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
`;

const ProductCard = styled.div`
  padding: 15px;
  background-color: ${(props) => props.theme.colors.tertiary};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ProductName = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.warning};
  margin-bottom: 5px;
  text-align: center;
`;

const ProductInfo = styled.div`
  font-size: 14px;
  color: ${(props) => props.theme.colors.white};
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-weight: bold;
  margin: 4px 0;
  span {
    font-weight: normal;
  }
`;

const ProductActions = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 10px;
  width: 100%;
  justify-content: center;
`;

const BackButton = styled.button`
  width: 100px;
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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 10px;

  button {
    padding: 6px 12px;
    font-size: 14px;
    border: none;
    border-radius: 4px;
    background-color: #4E41F0;
    color: white;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const List: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [updatedProduct, setUpdatedProduct] = useState<Partial<Product>>({});

  useEffect(() => {
    api
      .get('/api/produtos', { params: { page, size: 15 } })
      .then((response) => {
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error('Erro ao buscar produtos', error);
      });
  }, [page]);

  const handleEdit = (id: string) => {
    setEditMode(id);
    const productToEdit = products.find((product) => product.id === id);
    if (productToEdit) {
      setUpdatedProduct({
        nome: productToEdit.nome,
        preco: productToEdit.preco,
        quantidade: productToEdit.quantidade,
      });
    }
  };

  const handleSave = (id: string) => {
    const product = products.find((product) => product.id === id);
    if (!product) return;

    const updated = { ...product, ...updatedProduct };
    api
      .put(`/api/produtos/${id}`, updated)
      .then((response) => {
        setProducts(products.map((p) => (p.id === id ? response.data : p)));
        setEditMode(null);
      })
      .catch((error) => {
        console.error('Erro ao salvar produto', error);
      });
  };

  const handleDelete = (id: string) => {
    api
      .delete(`/api/produtos/${id}`)
      .then(() => {
        setProducts(products.filter((product) => product.id !== id));
      })
      .catch((error) => {
        console.error('Erro ao deletar produto', error);
      });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const filteredProducts =
    filter === "all"
      ? products
      : products.filter(
          (product) =>
            product.categoria.toLowerCase() === filter.toLowerCase()
        );

  return (
    <div>
      <ContentHeader title="Estoque da Cantina" lineColor="#4E41F0">
        <Select value={filter} onChange={handleFilterChange}>
          <option value="all">Todos</option>
          <option value="BEBIDAS">Bebidas</option>
          <option value="LANCHES">Lanches</option>
          <option value="DOCES">Doces</option>
        </Select>
        <BackButton onClick={() => navigate("/controle_estoque")}> 
          <IoArrowBack size={16} /> Voltar
        </BackButton>
      </ContentHeader>

      <ProductList>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id}>
            {editMode === product.id ? (
              <EditForm>
                <StyledInput
                  placeholder="Nome"
                  value={updatedProduct.nome || ''}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      nome: e.target.value,
                    })
                  }
                />
                <StyledInput
                  type="number"
                  placeholder="Preço"
                  value={updatedProduct.preco ?? ''}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      preco: parseFloat(e.target.value),
                    })
                  }
                />
                <StyledInput
                  type="number"
                  placeholder="Quantidade"
                  value={updatedProduct.quantidade ?? ''}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      quantidade: parseInt(e.target.value),
                    })
                  }
                />
                <ButtonGroup>
                  <Button
                    variant="save"
                    onClick={() => {
                      if (window.confirm('Deseja realmente salvar?')) {
                        handleSave(product.id);
                      }
                    }}
                  >
                    Salvar
                  </Button>
                  <Button variant="cancel" onClick={() => setEditMode(null)}>
                    Cancelar
                  </Button>
                </ButtonGroup>
              </EditForm>
            ) : (
              <>
                <ProductName>{product.nome}</ProductName>
                <ProductInfo>
                  Categoria: <span>{product.categoria}</span>
                </ProductInfo>
                <ProductInfo>
                  Preço: <span>R$ {product.preco.toFixed(2)}</span>
                </ProductInfo>
                <ProductInfo>
                  Quantidade: <span>{product.quantidade}</span>
                </ProductInfo>
                <ProductActions>
                  <Button variant="edit" onClick={() => handleEdit(product.id)}>
                    Editar
                  </Button>
                  <Button
                    variant="delete"
                    onClick={() => {
                      if (window.confirm('Deseja realmente excluir este produto?')) {
                        handleDelete(product.id);
                      }
                    }}
                  >
                    Excluir
                  </Button>
                </ProductActions>
              </>
            )}
          </ProductCard>
        ))}
      </ProductList>

      <Pagination>
        <button onClick={() => setPage((prev) => prev - 1)} disabled={page === 0}>
          Anterior
        </button>
        <span>Página {page + 1} de {totalPages}</span>
        <button onClick={() => setPage((prev) => prev + 1)} disabled={page + 1 >= totalPages}>
          Próxima
        </button>
      </Pagination>
    </div>
  );
};

export default List;
