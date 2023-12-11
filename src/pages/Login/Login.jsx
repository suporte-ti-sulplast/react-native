import React, { useState, useContext, useEffect } from "react";
import "./index.scss";
import Modal from 'react-modal';
import { AuthContext } from "../../contexts/auth";
import AnimatedContainer from '../../hooks/motion';
import './modalStylesForgot.scss'; // Importo estilos dos modais

const Login = () => {

    const { login, userStatus} = useContext(AuthContext);

    const [userLogin, setUserLogin] = useState("");
    const [userPassword, setUserPassword] = useState("JKZq6(bm");
    const [errorLogin, setErrorLogin] = useState("error-message-hidden");
    const [errorPassword, setErrorPassword] = useState("error-message-hidden");
    const [textErroLogin, setTextErroLogin] = useState("texto")
    const [textErroPassword, setTextErroPassword] = useState("texto")
    const [eyeSenha, setEyeSenha] = useState("aberto") //variavel para abrir ou fechar o olho
    const [typeofPassword, setTypeofPassword] = useState("password") //variavel para mudar o type de senha
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

    const erros = (userStatus) => {
        switch(userStatus) {
            case 1:
                setErrorLogin("error-message-show");
                setTextErroLogin("Usuário ou senha incorreta.");
                setErrorPassword("error-message-show");
                setTextErroPassword("Usuário ou senha incorreta.");
                
            break;

            case 2:
                setErrorLogin("error-message-show");
                setTextErroLogin("Usuário ou senha incorreta.");
                setErrorPassword("error-message-show");
                setTextErroPassword("Usuário ou senha incorreta.");
            break;

            case 3:
                setErrorLogin("error-message-show");
                setTextErroLogin("Usuário ou senha incorreta.");
                setErrorPassword("error-message-show");
                setTextErroPassword("Usuário ou senha incorreta.");
            break;

            case 4:
                setErrorLogin("error-message-show");
                setTextErroLogin("Bloqueado por excesso de tentativas.");
                setErrorPassword("error-message-show");
                setTextErroPassword("Bloqueado por excesso de tentativas.");
            break;
        }
    }

    useEffect(() => {
        erros(userStatus);
    }, [userStatus]); 
      
    
    const handleSubmit =  async (e) => {
        
        e.preventDefault();
        //verifica se senha e login estão preenchidos
        if(userLogin === "" || userPassword === "" )
        {
            //se login não preenchido
            if(userLogin === "" || userLogin === undefined)
            {
                setErrorLogin("error-message-show");
                setTextErroLogin("Nome de usuário requerido.");
            }
            //se senha não preenchido
            if(userPassword === "" || userPassword === undefined)
            {
                setErrorPassword("error-message-show");
                setTextErroPassword("Senha requerida.");
            }
        } 
        else 
        {
            try {
                await login(userLogin, userPassword);
                erros(userStatus);
              } catch (error) {
                // Lida com erros durante o login
              };
        };
    };

    const handleForgot = () => {
        setIsForgotModalOpen(true);
    }

    return (
        <AnimatedContainer>
            <section className="login">
                <div className="group">

                    <div className="leftSide">
                        <a href="https://www.sulplast.com.br/pt_BR" target="_blank" rel="noopener noreferrer">
                            <img src="../images/logoSulplastBranco.png" alt="logoSulplastBranco" />
                            <h1>Sulplast</h1>
                            <h3>Bem-vindo à INTRANET</h3>
                        </a>
                    </div>

                    <div className="rigthSide">
                        <form className="form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    id="userLogin"
                                    type="text"
                                    placeholder="Seu usuário"
                                    name="userLogin"
                                    value={userLogin}
                                    onChange={(e) => {
                                        setUserLogin(e.target.value)
                                        setErrorLogin("error-message-hidden");
                                    }} 
                                />
                                <div className={'error-message ' + errorLogin}>{textErroLogin}</div>
                            </div>
                            <div className="form-group">
                                <div className="pswd">
                                    <input 
                                        id="userPassword"
                                        type={typeofPassword}
                                        placeholder="Sua senha"
                                        name="userPassword"
                                        value={userPassword}
                                        onChange={(e) => {
                                            setUserPassword(e.target.value);
                                            setErrorPassword("error-message-hidden");
                                        }} 
                                    />
                                    <img className="eye" src={"../images/olho-" + eyeSenha +  ".png"} alt="" 
                                        onClick={(e) => {
                                            eyeSenha === "aberto" ? setEyeSenha("fechado") : setEyeSenha("aberto")
                                            typeofPassword === "password" ? setTypeofPassword("texto") : setTypeofPassword("password")
                                        }}
                                    />
                                </div>
                                <div className={'error-message ' + errorPassword}>{textErroPassword}</div>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="defaultBtn inBtn botão-login"
                                onClick={(e) => {
                                    setErrorLogin("error-message-hidden");
                                    setErrorPassword("error-message-hidden");
                                }}>Entrar</button>
                                <p className="forget"
                                    onClick={handleForgot}>Esqueci a senha ...</p>
                            </div>
                        </form>
                    </div>

                </div>

        {/* //MODAL PARA ESQUECIA A SENHA */}
      <Modal
        className="custom-modal-forgot" // Classe personalizada para estilização
        isOpen={isForgotModalOpen}
        onRequestClose={() => {
          setIsForgotModalOpen(false);
        }}
      >
        <h2>Solicitar uma nova senha</h2>

        <p><span>Para solictar uma nova senha, favor entrar em <br />contato com o departamento de TI</span> - Ramal 114</p>

        <div className="botoes">
          <button className="defaultBtn escBtn" onClick={() => setIsForgotModalOpen(false)}>Fechar</button>
        </div>

      </Modal>  
            </section>
        </AnimatedContainer>
    );
};

export default Login;