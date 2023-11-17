import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { createSession, findLogged } from "../services/apiLoginUser";
import { depptoStatus } from "../services/apiMASTER";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    //VARIAVEIS E CONSTATNTES
    var setUserOk;
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [userLogged, setUserLogged] = useState(null);
    const [userRecovered, setUserRecovered] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [dataAge, setDataAge] = useState('');
    const [userStatus, setUserStatus] = useState(0);
    const [logged, setLogged] = useState(false);
    const [deptto, setDeptto] = useState([]);
    const [stattus, setStattus] = useState([]);
    const [levvel, setLevvel] = useState([]);

    //RECUPERA DO LOCALSTORAGE O USER SALVO
    useEffect(() => {
        verifyLogded();
    },[]); 

    const verifyLogded = async () => {
        const recoveredUser = localStorage.getItem('user')
        setAuthenticated(false)
        if(recoveredUser) {
        setUserRecovered(JSON.parse(recoveredUser));
        setAuthenticated(false)
        }
        setLoading(false);
        setAuthenticated(false);
    };

    useEffect(() => {
    }, [userRecovered, userLogged], dataAge, deptto, stattus, levvel);
    
    
    useEffect(() => {
        // Define a lógica para atualizar a variável 'logged' com base em 'userStatus'
        switch (userStatus) {
          case 1:
          case 2:
          case 3:
          case 4:
            setLogged(false);
            break;
          
          case 5:
            setLogged(true);
            break;
    
          default:
            setLogged(false);
            break;
        }
      }, [userStatus]);



    //função para login
    const login = async (login, password) => {

        //chama a api que verifica se existe o usuário e senha
        const response = await createSession(login, password );
        setUserOk =  response.data.userOK; 

        switch(setUserOk) {
            case 1:
                setUserStatus(1);
                navigate("/");    //não tem usuário     
            break;

            case 2:
                setUserStatus(2);
                navigate("/");    // tem, mas está diferente de ativo => 2
            break;

            case 3:
                setUserStatus(3);
                navigate("/");  // tem, mas a senha está errada => 3 
            break;

            case 4:
                setUserStatus(4);
                navigate("/");  // tem, mas errou a senha e foi bloqueado => 4
            break;

            case 5:
                setUserStatus(5);
                navigate("/");   // tudo certo => 5
            break;
        }

        //se existe o usuário
        if(setUserOk === 5){
            const token = response.data.token;

            //chama a api que pega os dados do usuário e repassa para o context para ser usado no cabeçalho de todas as páginas
            try {
                const resp = await findLogged(response.data.userLogin);
                console.log(resp)
                setUserLogged(resp);
                setDataAge(resp.dataAge);
                setLoading(false);
                setAuthenticated(true);
            } catch (err) {
                console.error('Ocorreu um erro durante a consulta:', err);
                setLoading(false);
            }

            try {
                const depptoStattus = await depptoStatus();
                setDeptto(depptoStattus.deptto)
                setStattus(depptoStattus.stattus)
                setLevvel(depptoStattus.level)
            } catch (error) {
                console.error('Ocorreu um erro durante a consulta:', error);
                setLoading(false);
            }

            setUser({
                userLogin: response.data.userLogin,
                token: token
            });

            localStorage.setItem('user', JSON.stringify(response.data.userLogin));
            localStorage.setItem('token', JSON.stringify(token));

            navigate("/home"); 
        } 
    };

    //função para logout
    const logout = () => {
        setUserOk = 0 ;
        setUser(null);
        setAuthenticated(false);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("retract");
        navigate("/");
    };

    //função para receber de volta a data da senha atualizada
    const updateDataAge = (newDataAge) => {
        setDataAge(newDataAge);
      };

    return (
        <AuthContext.Provider
            value={
                    {
                        authenticated,
                        userRecovered,
                        user,
                        loading,
                        userLogged,
                        dataAge,
                        userStatus,
                        deptto,
                        stattus,
                        levvel,
                        setUserOk,
                        /*FUNÇÕES */
                        login,
                        logout,
                        updateDataAge //função para receber de volta a data da senha atualizada
                    }    
            }>
            { children }
        </AuthContext.Provider>
    )
}