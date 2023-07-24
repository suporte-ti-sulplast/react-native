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
import NotFound from "./pages/NotFound/NotFound";

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
                <Routes>
                    <Route exact path="/" element={<Login />} />
                    <Route exact path="/home" element=
                        {<Private>
                            <Home />
                        </Private>} />
                    <Route exact path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
            
        </Router>
    );
};

export default AppRoutes;