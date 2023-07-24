import React, { useState, useContext } from "react";
import "./index.scss";

import { AuthContext } from "../../contexts/auth";

const Login = () => {

    const { authenticated, login } = useContext(AuthContext);
    const [userLogin, setUserLogin] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [errorLogin, setErrorLogin] = useState("error-message-hidden");
    const [errorPassword, setErrorPassword] = useState("error-message-hidden");
    const [textErroLogin, setTextErroLogin] = useState("texto")
    const [textErroPassword, setTextErroPassword] = useState("texto")

    const handleSubmit =  (e) => {
        e.preventDefault();
        
        if(userLogin === "" || userPassword === "" ){
            if(userLogin === "" || userLogin === undefined){
                setErrorLogin("error-message-show");
                setTextErroLogin("Nome de usuário requerido.");
            }
            if(userPassword === "" || userPassword === undefined){
                setErrorPassword("error-message-show");
                setTextErroPassword("Senha requerida.");
            }
        } else if(!authenticated){
            setErrorPassword("error-message-show")
            setErrorLogin("error-message-show")
            setTextErroLogin("Usuário ou senha inválidos.");
            setTextErroPassword("Usuário ou senha inválidos.");
        }
        
        login(userLogin, userPassword); //passa as informações para o AuthContexto
    };

    return (
        <div className="login">
            <div className="group">

                <div className="leftSide">
                    <img src="../images/logoSulplastBranco.png" alt="logoSulplastBranco" />
                    <h1>Sulplast</h1>
                    <h3>Bem-vindo à INTRANET</h3>
                </div>

                <div className="rigthSide">
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="userLogin">Login</label>
                            <input
                                type="text"
                                placeholder="Seu usuário"
                                name="userLogin"
                                id="userLogin"
                                value={userLogin}
                                onChange={(e) => {
                                    setUserLogin(e.target.value)
                                    setErrorLogin("error-message-hidden");
                                }} 
                            />
                            <div className={'error-message ' + errorLogin}>{textErroLogin}</div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="userPassword">Senha</label>
                            <input 
                                type="password"
                                placeholder="Sua senha"
                                name="userPassword"
                                id="userPassword"
                                value={userPassword}
                                onChange={(e) => {
                                    setUserPassword(e.target.value);
                                    setErrorPassword("error-message-hidden");
                                }} 
                            />
                            <div className={'error-message ' + errorPassword}>{textErroPassword}</div>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="defaultBtn">Entrar</button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Login;