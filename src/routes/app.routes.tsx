import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from "../components/Layout";
import Dashboard from '../pages/Dashboard';
import List from '../pages/Estoque';
import CadastroEstoque from '../pages/Cadastrar_Produto';
import Vendas from '../pages/Registrar_Venda';
import Entradas from '../pages/Entradas';
import Saídas from '../pages/Saídas';
import CadastroFuncionario from '../pages/Funcionarios';
import RegistroEntradas from '../pages/Registrar_Entradas';
import ControleEstoque from '../pages/Painel_De_Controle';
import Relatorio from '../pages/Relatorio';
import PrivateRoute from '../hooks/PrivateRoute';

const AppRoutes: React.FC = () => (

    <Layout>
        <Routes>
            <Route path="/" element={<PrivateRoute><ControleEstoque /></PrivateRoute>} />
            <Route path="/estoque" element={<PrivateRoute><List /></PrivateRoute>} />
            <Route path="/cadastro_estoque" element={<PrivateRoute><CadastroEstoque /></PrivateRoute>} />
            <Route path="/vendas" element={<PrivateRoute><Vendas /></PrivateRoute>} />
            <Route path="/entradas" element={<PrivateRoute><Entradas /></PrivateRoute>} />
            <Route path="/Registro-Entradas" element={<PrivateRoute><RegistroEntradas /></PrivateRoute>} />
            <Route path="/saidas" element={<PrivateRoute><Saídas /></PrivateRoute>} />
            <Route path="/controle_estoque" element={<PrivateRoute><ControleEstoque /></PrivateRoute>} />
            <Route path="/funcionarios" element={<PrivateRoute><CadastroFuncionario /></PrivateRoute>} />
            <Route path="/relatorio" element={<PrivateRoute><Relatorio /></PrivateRoute>} />
            
        </Routes>
    </Layout>
);

export default AppRoutes;
