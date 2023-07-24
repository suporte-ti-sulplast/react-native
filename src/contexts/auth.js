import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate();

    //Se user == null, authenticated == false
    //Se user != null, authenticated == true
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const recoveredUser = localStorage.getItem('user')
        if(recoveredUser) {
        setUser(JSON.parse(recoveredUser))
        }
        setLoading(false);
    },[]);

    const login = (login, password) => {

        const loggedUser = {
            id: "123",
            password,
        }; 

        if(password === "secret"){
            localStorage.setItem('user', JSON.stringify(loggedUser))
            setUser(loggedUser);
            navigate("/home");
        };
    };

    const logout = () => {
        console.log("logout");
        setUser(null);
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <AuthContext.Provider
            value={{authenticated: !!user, user, loading, login, logout}}>
            { children }
        </AuthContext.Provider>
    )
}