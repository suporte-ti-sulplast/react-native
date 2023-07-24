import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { api, createSession } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate();

    //Se user == null, authenticated == false
    //Se user != null, authenticated == true
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(""); 
    const [department, setDepartment] = useState(""); 
    const [access_level, setAccessLevel] = useState(""); 

    useEffect(() => {
        const recoveredUser = localStorage.getItem('user')
        if(recoveredUser) {
        setUser(JSON.parse(recoveredUser))
        }
        setLoading(false);
    },[]);

    const login = async (login, password) => {

        const response = await createSession(login, password );
        const loggedUser = response.data.name;
        const loggedToken = response.data.token;

        setDepartment(response.data.department);
        setAccessLevel(response.data.access_level);

        if(password === "secret"){
            localStorage.setItem('user', JSON.stringify(loggedUser))
            localStorage.setItem('department', JSON.stringify(department))
            localStorage.setItem('access_level', JSON.stringify(access_level))
            localStorage.setItem('token', JSON.stringify(loggedToken))
            setUser(loggedUser);
            navigate("/home");
        };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("department");
        localStorage.removeItem("access_level");
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <AuthContext.Provider
            value={{authenticated: !!user, user, loading, login, logout, department, access_level}}>
            { children }
        </AuthContext.Provider>
    )
}