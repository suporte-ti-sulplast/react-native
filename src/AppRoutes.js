import React, { useContext } from "react";
import { findLogged } from "./services/apiLoginUser";

import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate
} from "react-router-dom";

import Login from './pages/Login/Login';
import Home from './pages/Home/Home';

import { AuthProvider, AuthContext } from "./contexts/auth";
import { RetractProvider } from './contexts/retract'; 

import NotFound from "./pages/NotFound/NotFound";

import AdmTI from "./pages/AdmTI/ADM-TI";

import NoticiasCreate from "./pages/AdmTI/news-create";
import NoticiasList from "./pages/AdmTI/news-list";
import NoticiasEdit from "./pages/AdmTI/news-edit";

import UserList from "./pages/AdmTI/user-list";
import UserEdit from "./pages/AdmTI/user-edit";
import UserCreate from "./pages/AdmTI/user-create";

import PrinterList from "./pages/AdmTI/printer-list";
import PrinterCreate from "./pages/AdmTI/printer-create";
import PrinterEdit from "./pages/AdmTI/printer-edit"; 

import Financeiro from "./pages/Financeiro/Financeiro";
import FinRelatorioFechamnetoEstoque from "./pages/Financeiro/rel-fechamento-estoque";

import Etiquetas from "./pages/Etiquetas/Etiquetas";
import EtiquetasQualidade from "./pages/Etiquetas/etiq-qualidade";
import EtiquetasCura from "./pages/Etiquetas/etiq-cura";
import EtiquetasData from "./pages/Etiquetas/etiq-data";
import EtiquetasTeste from "./pages/Etiquetas/etiq-teste";
import EtiquetasRoto from "./pages/Etiquetas/etiq-roto";

import Portaria from "./pages/Portaria/Portaria";
import PortControleMovimentoVeiculos from "./pages/Portaria/controle-movimento-veiculos";
import PortControleListaVeiculos from "./pages/Portaria/controle-lista-veiculos";
import PortControleMovimentoNovo from "./pages/Portaria/controle-movimento-novo";


const AppRoutes = () => {

    const Private = ({ children }) => {

       
        const { userLogged, loading, setUserOk } = useContext(AuthContext);
        const recoveredUser = localStorage.getItem('user')
        if(loading){
            return <div className="loading">Carregando ...</div>
        };
        if(!userLogged){
            return <Navigate to="/" />
        };

        return children ;
    };

    return (
        <Router>
            <AuthProvider>
                <RetractProvider>
                    <Routes>
                        <Route exact path="/" element={<Login />} />

                        <Route exact path="/HOME" element={

                                <Home />

                            }
                            />


                        <Route exact path="/ADM-TI" element=
                            {<Private>
                                <AdmTI />
                            </Private>} />     


                        <Route exact path="/ADM-TI/cadastro-usuarios" element=
                            {<Private>
                                <UserList/>
                            </Private>} />    
                        <Route exact path="/ADM-TI/cadastro-usuarios/edit" element=
                            {<Private>
                                <UserEdit/>
                            </Private>} />        
                        <Route exact path="/ADM-TI/cadastro-usuarios/create" element=
                            {<Private>
                                <UserCreate/>
                            </Private>} />     


                        <Route exact path="/ADM-TI/cadastro-impressoras" element=
                            {<Private>
                                <PrinterList/>
                            </Private>} />       
                        <Route exact path="/ADM-TI/cadastro-impressoras/create" element=
                            {<Private>
                                <PrinterCreate/>
                            </Private>} /> 
                        <Route exact path="/ADM-TI/cadastro-impressoras/edit" element=
                            {<Private>
                                <PrinterEdit/>
                            </Private>} /> 


                        <Route exact path="/ADM-TI/cadastro-noticias" element=
                            {<Private>
                                <NoticiasList/>
                            </Private>} />         
                        <Route exact path="/ADM-TI/cadastro-noticias/create" element=
                            {<Private>
                                <NoticiasCreate/>
                            </Private>} />      
                        <Route exact path="/ADM-TI/cadastro-noticias/edit" element=
                            {<Private>
                                <NoticiasEdit/>
                            </Private>} />       



                        <Route exact path="/Financeiro" element=
                            {<Private>
                                <Financeiro/>
                            </Private>} />    
                        <Route exact path="/Financeiro/relatorio-fechamentoEstoque" element=
                            {<Private>
                                <FinRelatorioFechamnetoEstoque/>
                            </Private>} /> 


                        <Route exact path="/Etiquetas" element=
                            {<Private>
                                <Etiquetas/>
                            </Private>} />      
                        <Route exact path="/Etiquetas/etiquetas-qualidade" element=
                            {<Private>
                                <EtiquetasQualidade/>
                            </Private>} />  
                        <Route exact path="/Etiquetas/etiquetas-cura" element=
                            {<Private>
                                <EtiquetasCura/>
                            </Private>} />  
                        <Route exact path="/Etiquetas/etiquetas-data" element=
                            {<Private>
                                <EtiquetasData/>
                            </Private>} />
                        <Route exact path="/Etiquetas/etiquetas-teste" element=
                            {<Private>
                                <EtiquetasTeste/>
                            </Private>} />  
                        <Route exact path="/Etiquetas/etiquetas-roto" element=
                            {<Private>
                                <EtiquetasRoto/>
                            </Private>} />  


                        <Route exact path="/Portaria" element=
                            {<Private>
                                <Portaria/>
                            </Private>} />  
                        <Route exact path="/Portaria/controle-lista-veiculos" element=
                            {<Private>
                                <PortControleListaVeiculos/>
                            </Private>} />   
                        <Route exact path="/Portaria/controle-movimento-veiculos" element=
                            {<Private>
                                <PortControleMovimentoVeiculos/>
                            </Private>} />   
                        <Route exact path="/Portaria/controle-movimento-novo" element=
                            {<Private>
                                <PortControleMovimentoNovo/>
                            </Private>} />   

                        <Route exact path="*" element={<NotFound />} />
                    </Routes>
                </RetractProvider>
            </AuthProvider>
        </Router>
    );
};

export default AppRoutes;