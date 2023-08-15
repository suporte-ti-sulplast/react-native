import React, { useContext } from "react";

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
import UserList from "./pages/AdmTI/user-list";
import UserEdit from "./pages/AdmTI/user-edit";
import UserCreate from "./pages/AdmTI/user-create";

const AppRoutes = () => {

    const Private = ({ children }) => {
        const { authenticated, loading } = useContext(AuthContext);
        if(loading){
            return <div className="loading">Carregando ...</div>
        };
        if(!authenticated){
            return <Navigate to="/" />
        };
        return children;
    };

    return (
        <Router>
            <AuthProvider>
                <RetractProvider>
                    <Routes>
                        <Route exact path="/" element={<Login />} />

                        <Route exact path="/HOME" element=
                            {<Private>
                                <Home />
                            </Private>} />
                            
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

                        <Route exact path="*" element={<NotFound />} />
                    </Routes>
                </RetractProvider>
            </AuthProvider>
        </Router>
    );
};

export default AppRoutes;