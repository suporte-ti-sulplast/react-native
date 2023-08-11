import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { createSession} from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    //VARIAVEIS E CONSTATNTES
    var setUserOk;
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(); 


    //RECUPERA DO LOCALSTORAGE O USER SALVO
    useEffect(() => {
        const recoveredUser = localStorage.getItem('user')
        if(recoveredUser) {
        setUser(JSON.parse(recoveredUser))
        }
        setLoading(false);
    },[]); 

    const login = async (login, password) => {

        const response = await createSession(login, password );

        setUserOk =  response.data.userOK;

        if(!setUserOk){
            navigate("/"); 
        } 

        if(setUserOk){

            setUser({
                userLogin: response.data.userLogin,
                nameComplete: response.data.nameComplete,
                department: response.data.department,
                accessLevel: response.data.accessLevel,
                applications: response.data.applications,
                token: response.data.token
            });

            localStorage.setItem('user', JSON.stringify(response.data.userLogin));
            localStorage.setItem('token', JSON.stringify(response.data.token));

            navigate("/home"); 
        } 
    };

    const logout = () => {
        setUserOk = false ;
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("retract");
        navigate("/");
    };

    return (
        <AuthContext.Provider
            value={
                    {
                        authenticated: !!user,
                        user,
                        loading,

                        /*FUNÇÕES */
                        login,
                        logout
                    }    
            }>
            { children }
        </AuthContext.Provider>
    )
}