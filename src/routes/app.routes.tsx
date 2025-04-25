import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from "../components/Layout";
import Dashboard from '../pages/Dashboard';
import List from '../pages/Estoque';
import CadastroEstoque from '../pages/Cadastro_Estoque';
import Vendas from '../pages/Vendas';
import Entradas from '../pages/Entradas';
import Saídas from '../pages/Saídas';
import CadastroFuncionario from '../pages/Cadastro_Funcionario';
import RegistroEntradas from '../pages/Registro_Entradas';
import ControleEstoque from '../pages/Controle_Estoque';
import Relatorio from '../pages/Relatorio';

const AppRoutes: React.FC = () => (

    <Layout>
        <Routes>
            <Route path="/" element={<ControleEstoque />} />
            <Route path="/estoque" element={<List />} />
            <Route path="/cadastro_estoque" element={<CadastroEstoque />} />
            <Route path="/vendas" element={<Vendas />} />
            <Route path="/entradas" element={<Entradas />} />
            <Route path="/Registro-Entradas" element={<RegistroEntradas />} />
            <Route path="/saidas" element={<Saídas />} />
            <Route path="/controle_estoque" element={<ControleEstoque />} />
            <Route path="/funcionarios" element={<CadastroFuncionario />} />
            <Route path="/relatorio" element={<Relatorio />} />
        </Routes>
    </Layout>
);

export default AppRoutes;
