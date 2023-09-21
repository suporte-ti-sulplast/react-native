import { consulta } from "../../../services/apiDELSOFT"; //PARA TESTE DE SELECT DA DELSOFT

import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import './modalStyles.scss'; // Importo estilos dos modais
import Pagination from "react-bootstrap/Pagination";
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { findUsers, editUser, depptoStatus, alterPassword, validPassword, deleteUser, searchUsers} from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/auth';
import validadorSenha from '../../../functions/validadorSenha';
import geradorSenha from '../../../functions/geradorSenha';
import converteData from '../../../functions/converteData';
import calcularDiferencaEmDias from '../../../functions/calculaIdadeSenha';

Modal.setAppElement('#root'); 

const CadastroUsuarios =  () => {

  const navigate = useNavigate();
  const { user, dataAge, updateDataAge, userLogged, deptto, stattus, levvel } = useContext(AuthContext);
  const loogedUserLevel = user.accessLevel;
  const limitArowsPage = userLogged.settings[2].valueSet; //recupera do userLogged limite de linhas por página
  const depptto = deptto;
  const sttattus = stattus;
  const level = levvel;

  //CONTROLES DA PAGINAÇÃO
  const [state, setState] = useState({
    users: 0,
    limit: limitArowsPage,
    pages: [],
    activePage: 1,
    lastPage: 1
  });

  const handlePageChange = (pageNumber) => {
    setState((prev) => ({ ...prev, activePage: pageNumber }));
  }

  // Função para lidar com a mudança na seleção do LIMITE por linha
  const handleSelectChangeLimit = (event) => {
    // Atualize o estado com o novo valor selecionado
    const newValue = parseInt(event.target.value);
    setState((prev) => ({ ...prev, limit: newValue }));
    setState((prev) => ({ ...prev, activePage: 1 }));
  };

  useEffect(() => {
  }, [state.limit, state.activePage]);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  //MENSAGENS DE ERRO
  const [errorSenha, setErrorSenha] = useState("mensagem inicial");
  const [errorRedigiteSenha, setErrorRedigiteSenha] = useState("mensagem inicial");
  const [errorSenhaClass, setErrorSenhaClass] = useState("hidden");
  const [errorConfimSenhaClass, setErrorConfimSenhaClass] = useState("hidden");
  const [msg, setMsg] = useState("mensagem inicial");
  const [msgType, setMsgType] = useState("hidden");
  //  MODAL PARA ALTERAÇÃO DE SENHA
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [selectedLogin, setSelectedLogin] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [forceChange, setForceChange] = useState(false);
  //  MODAL PARA DELETAR USUÁRIO
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);
  const [selectediDToDelete, setSelectediDToDelete] = useState(null);
  // VARIAVEIS AUXILIARES
  const [control, setControl] = useState(false) //variavel para controle de recarregar a página qdo excluido o usuário
  const [password, setPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(8);
  const [newDataAge, setNewDataAge] = useState(dataAge);
  const [filterHidden, setFilterHidden] = useState(true);
  const [haveSearch, setHaveSearch] = useState("0"); //variavel para verifica se tem alguma pesquisa ou não
  const [reset, setReset] = useState(false); //variavel para resetar a consulta

  //CONTROLE DE VISIBILIDADE DA SENHA
  const [eyeSenha, setEyeSenha] = useState("aberto") //variavel para abrir ou fechar o olho
  const [typeofPassword, setTypeofPassword] = useState("password") //variavel para mudar o tipo de senha
  const [eyeReSenha, setEyeReSenha] = useState("aberto") //variavel para abrir ou fechar o olho
  const [typeofRePassword, setTypeofRePassword] = useState("password") //variavel para mudar o tipo de senha

  //CONSTANTE PARA OS FILTROS
  const [filter, setFilter] = useState({
    login: "",
    name: "",
    email: "",
    depto: "Todos",
    level: "Todos",
    stts: "Todos",
    sendEmail: "Todos",
    shared: "Todos",
    dtInicio: "",
    dtFim: ""
  });

  useEffect(() => {
    //desailitar o botão pesquisar //
  },[filter])

  //BUSCA NO SERVIDOR A LISTA DE USUÁRIOS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await findUsers(state.limit, state.activePage);
        setState((prev) => ({ ...prev, lastPage: response.data.quantidadePaginas }));
        const usersData = response.data.users;
        setUsers(usersData);  
        setLoading(false);
        setControl(false)
      } catch (err) {
        console.error('Ocorreu um erro durante a consulta:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, [control, state.activePage, state.limit, reset]);

  useEffect(() => {
    // Cria um array com números de 1 até lastPage
    const pagesArray = Array.from({ length: state.lastPage }, (_, index) => index + 1);
    // Atualiza o estado com o novo array de páginas
    setState(prevState => ({
      ...prevState,
      pages: pagesArray
    }));
  }, [state.users, state.limit, state.lastPage]);

  // DEVOLVE PARA O CONTEXT A VARIVAL AGE DA SENHA ATUALIZADA
  useEffect(() => {
    updateDataAge(newDataAge)
  }, [newDataAge]);

  useEffect(() => {
  }, [users, reset, haveSearch]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  //BUSCA NO BANCO A LISTA DE DEPARTAMENTO E STATUS
  const handleEdit = async (userId) => {
   const getUserData = async () => {
    try {
      const userData = await editUser(userId);
      const depptoStattus = await depptoStatus();
      const combinedState = {
        userData: userData,
        depptoStatus: depptoStattus
    };
      navigate("/ADM-TI/cadastro-usuarios/edit", {state: combinedState  }); 
      
      } catch (error) {
        console.error("Ocorreu um erro ao obter os dados do usuário:", error);
      }
    };
  getUserData();
  };

  //  MODAL PARA DELETAR USUÁRIO
  const handleDelete = (userId, login) => {
    setSelectedUserToDelete(login);
    setSelectediDToDelete(userId);
    setIsDeleteModalOpen(true);
  };
  const handleDeleteUserConfirmed = async (user) => {
    if (user) {
      const response = await deleteUser(selectediDToDelete);
      setIsDeleteModalOpen(false);
      setSelectedUserToDelete(null);
      setMsg(response.msg)
      if(response.msg_type === "success") {
        setMsgType("success")
      } else {
        setMsgType("error")
      }
      // Redirecionar de volta para a mesma rota (página de cadastro de usuários)
      navigate("/ADM-TI/cadastro-usuarios"); 
      // Define um atraso de 3 segundos (3000 milissegundos) para reverter para "hidden"  
      setTimeout(() => {
        setMsgType("hidden");
      }, 3000);
      closeModal();
      setControl(true)
    }
  };//FIM DA EXCLUSÃO DE USUÁRIO

  //  MODAL PARA ALTERAÇÃO DE SENHA
  const handleChangePassword = (userId, login) => {
    setSelectedLogin(login)
    setSelectedId(userId)
    setIsModalOpen(true);
    setTypeofPassword("password");
    setTypeofRePassword("password");
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setNewPassword('');
    setNewPasswordConfirm('');
    setErrorSenhaClass('hidden');
    setErrorConfimSenhaClass('hidden');
    setPassword("");
    setEyeSenha("aberto");
    setEyeReSenha("aberto");
    setTypeofPassword("password");
    setTypeofRePassword("password");
    setNewDataAge('90');
    updateDataAge(newDataAge);
  };

  // Lógica para alterar a senha
  const handleSubmit = async () => {
    //VERIFICA REGRAS DAS SENHAS
    //VERIFICA SE ESTÁ PREENCHIDA AS VARIÁVEIS SENHA E CONFIRMÇÃO DE SENHA
    if(newPassword === "" || newPassword === undefined || newPasswordConfirm === ""  || newPasswordConfirm === undefined ){
      if(newPassword === "" || newPassword === undefined){
        setErrorSenha("Senha requerida");
        setErrorSenhaClass("");
      }
      if(newPasswordConfirm === ""  || newPasswordConfirm === undefined){
        setErrorRedigiteSenha("Confirmação requerida");
        setErrorConfimSenhaClass("");
      }    
    } else if(newPassword !== newPasswordConfirm ) {
      setErrorSenha("Senhas não conferem");
      setErrorRedigiteSenha("Senhas não conferem");
      setErrorSenhaClass("");
      setErrorConfimSenhaClass("");
    } else if(!validadorSenha(newPassword)) {
      setErrorSenha("Formato Inválido");
      setErrorRedigiteSenha("Formato Inválido");
      setErrorSenhaClass("");
      setErrorConfimSenhaClass("");
    } else {
      const resp = await validPassword(selectedId, newPassword);

      if(resp.validated === false)
      {
        setErrorSenha("Senha já usada");
        setErrorRedigiteSenha("Senha já usada");
        setErrorSenhaClass("");
        setErrorConfimSenhaClass("");
      } 
      else 
      {
        const response = await alterPassword(selectedId, newPassword, forceChange );
        setMsg(response.msg);
        
        if(response.msg_type === "success")
        {
          setMsgType("success");
          //LIMPA O FORMULÁRIO
          setForceChange(false);
          setNewPassword("");
          setNewPasswordConfirm("");
          // Define um atraso de 3 segundos (3000 milissegundos) para reverter para "hidden"  
          setTimeout(() => {
            setMsgType("hidden");
          }, 3000);
            closeModal();
        } else
        {
          setMsgType("error");
        }
      }
    }
  };

  /*COPIA A SENHA GERADA DENTRO DO INPUT SENHA*/
  const handleCopy = () => {
    setNewPassword(password);
    setNewPasswordConfirm(password);
  };  //FIM DA ALTERAÇÃO DE SENHA

  /*FUNÇÃO GERADOR DE SENHA*/
  const handlePassword = () => {
    setPassword(geradorSenha(passwordLength));
  };
  
  /* FUNÇÃO DO BOTÃO NOVO ... VAI PARA TELA DE NOVO USUÁRIO*/
  const handleNew = (e) => {
    const getDepptoStattus = async () => {
      try {
        const depptoStattus = await depptoStatus();
        navigate("/ADM-TI/cadastro-usuarios/create", {state: depptoStattus  });         
        } catch (error) {
          console.error("Ocorreu um erro ao obter os dados do usuário:", error);
        }
      };
      getDepptoStattus();
  }

  const handleFilterShow = () => {
    setFilterHidden(!filterHidden);
  };

  const handleClear = () => {
    setReset(!reset)
    console.log(reset)
    setHaveSearch("0")
    setFilter
    (prevState =>
      ({
        ...prevState,
        login: "",
        name: "",
        email: "",
        depto: "Todos",
        level: "Todos",
        stts: "Todos",
        sendEmail: "Todos",
        shared: "Todos",
        dtInicio: "",
        dtFim: ""
      })
    )
  };

  const handleSearch = async () => {
    setHaveSearch("1")
      try {
        const response = await searchUsers(filter, state.limit, state.activePage);
        setState((prev) => ({ ...prev, lastPage: response.data.quantidadePaginas }));
        const usersDataSearche = response.data.users;
        setUsers(usersDataSearche);  

        setLoading(false);
        setControl(false)
      } catch (err) {
        console.error('Ocorreu um erro durante a consulta:', err);
        setLoading(false);
      }
  };


  /* FUNÇÃO TESTE PARA CONSULTA DO FINANCEIRO
  const handleConsulta = async (e) => {

      console.log("chegou aqui")
      try {
        const Consulta = await consulta();
    
        } catch (error) {
          console.error("Ocorreu um erro ao obter os dados do usuário:", error);
        }
  } */

    return (
    <section className="cadastroUsuarios">
      <div className="titulo">

        <h2>Usuários</h2>

        <div className="paginação">

          <div className="input-group mb-3">
            <label className="input-group-text" htmlFor="inputGroupSelect01">Por página</label>
            <select className="form-select"
              id="inputGroupSelect01"
              value={state.limit}
              onChange={handleSelectChangeLimit}
              >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>

{/*           <div>&emsp;</div>
          <div className="input-group mb-3">
            <label className="input-group-text" htmlFor="inputGroupSelect02">Por busca</label>
            <select className="form-select"
              id="inputGroupSelect02"
              value={state.maxRegisters}
              onChange={handleSelectChangeMaxRegisters}
            >
              <option value="100">100</option>
              <option value="250">250</option>
              <option value="500">500</option>
            </select>
          </div> */}

          <Pagination className="px-4">
            {state.pages.map((_, index) => {
              return (
                <Pagination.Item
                  onClick={() => handlePageChange(index + 1)}
                  key={index + 1}
                  active={index + 1 === state.activePage}
                >
                  {index + 1}
                </Pagination.Item>
              );
            })}
          </Pagination>

        </div>
          
        <button className="Btn defaultBtn" type="button" onClick ={handleNew}>Novo Usuário</button>
      </div>

      <form action="" className="filtro">

          <div className="btn-filtros" onClick={() => handleFilterShow()}> 
            <p><strong>FILTROS  </strong></p>
          </div> 

          <hr style={{marginBottom: "1rem"}} className={"linha" + (filterHidden ? "filterHidden" : "")}/>

          <div className={"linha" + (filterHidden ? "filterHidden" : "")}>
            
              <div className="input-filtro">
                <label htmlFor="login">Login</label>
                <input
                  type="text"
                  name="login"
                  id="login"
                  value={filter.login}
                  onChange={(e) => {
                    setFilter((prevState) => ({
                      ...prevState,
                      login: e.target.value
                    }));
                    setHaveSearch("1");
                  }} 
                />
              </div>

              <div className="input-filtro">
                <label htmlFor="nome">Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={filter.name}
                  id="nome"
                  onChange={(e) => {
                    setFilter((prevState) => ({
                      ...prevState,
                      name: e.target.value
                    }));
                    setHaveSearch("1");
                  }} 
                />
              </div>

              <div className="input-filtro">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  value={filter.email}
                  id="email" 
                  onChange={(e) => {
                    setFilter((prevState) => ({
                      ...prevState,
                      email: e.target.value
                    }));
                    setHaveSearch("1");
                  }} 
                />
              </div>

              <div className="input-filtro">
                <label htmlFor="department">Departameto</label>
                 <select name="department" id="department" value={filter.depto}
                  onChange={(e) => {
                    setFilter((prevState) => ({
                      ...prevState,
                      depto: e.target.value
                    }));
                    setHaveSearch("1");
                  }}
                 >
                 <option value="Todos">Todos</option>
                    {depptto.map((dept) => (
                      <option key={dept.department} value={dept.department}>
                       {dept.department}
                      </option>
                    ))}
                </select>
              </div>

              <div className="input-filtro">
                <label htmlFor="nivel">Nível de Acesso</label>
                <select name="level" id="level" value={filter.level}
                 onChange={(e) => {
                  setFilter((prevState) => ({
                    ...prevState,
                    level: e.target.value
                  }));
                  setHaveSearch("1");
                }}
              >
                <option value="Todos">Todos</option>
                    {level.map((lvl) => (
                      <option key={lvl.accessLevel} value={lvl.accessLevel}>
                       {lvl.accessLevel}
                      </option>
                    ))}
                </select>
              </div>

              <div className="input-filtro input-filtro-menor">
                  <label htmlFor="status">Status</label>
                  <select name="status" id="status" value={filter.stts}
                    onChange={(e) => {
                      setFilter((prevState) => ({
                        ...prevState,
                        stts: e.target.value
                      }));
                      setHaveSearch("1");
                    }}
                  >
                  <option value="Todos">Todos</option>
                      {sttattus.map((stt) => (
                        <option key={stt.stattus} value={stt.status}>
                        {stt.status}
                        </option>
                      ))}
                  </select>
              </div>

              <div className="input-filtro input-filtro-data">
                  <label htmlFor="data">Data Criação</label>
                  <div className="data">
                    <input className="dtInicio" type="date" name="dataInicial" id="data" value={filter.dtInicio}
                      onChange={(e) => {
                        setFilter((prevState) => ({
                          ...prevState,
                          dtInicio: e.target.value
                        }));
                        setHaveSearch("1");
                      }} 
                    />
                    <input className="dtFim" type="date" name="dataFinal" id="data" value={filter.dtFim} min={filter.dtInicio}
                    onChange={(e) => {
                      setFilter((prevState) => ({
                        ...prevState,
                        dtFim: e.target.value
                      }));
                      setHaveSearch("1");
                    }} 
                    />
                  </div>
                  
              </div>

              <div className="input-filtro input-filtro-menor">
                  <label htmlFor="sendEmail">Recebe E-mail</label>
                  <select name="sendEmail" id="sendEmail" value={filter.sendEmail}
                    onChange={(e) => {
                      setFilter((prevState) => ({
                        ...prevState,
                        sendEmail: e.target.value
                      }));
                      setHaveSearch("1");
                    }}
                  >
                    <option value="Todos">Todos</option>
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
              </div>

              <div className="input-filtro input-filtro-menor">
                  <label htmlFor="shared">Compartilhado</label>
                  <select name="shared" id="shared" value={filter.shared}
                    onChange={(e) => {
                      setFilter((prevState) => ({
                        ...prevState,
                        shared: e.target.value
                      }));
                      setHaveSearch("1");
                    }}
                  >
                    <option value="Todos">Todos</option>
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
              </div>

              <div className="search">
                <div data-bs-toggle="tooltip" data-bs-placement="top" title="Pesquisar">
                  <button
                    type="button"
                    onClick ={handleSearch}
                    disabled={haveSearch === "0"}
                    style={{
                      color: haveSearch === "1" ? 'black' : 'gray',
                      cursor: haveSearch === "1" ? 'pointer' : 'default'
                    }}>
                    <img alt="lupa-pesquisar" src={`../../images/lupa${haveSearch === "1" ? 'Verde' : 'Cinza'}.png`}/>
                  </button>
                </div>
                <div data-bs-toggle="tooltip" data-bs-placement="top" title="Limpar">
                  <button
                    type="button"
                    onClick ={handleClear}>
                      <img src="../../images/borracha.png" alt="borracha-limpar" />
                  </button>
                </div>
              </div>
          </div>

      </form>
      
{/*       <button className="Btn defaultBtn" type="button" onClick ={handleConsulta}>Consulta</button> */}
      
      <hr />
      
      <div className="tabela"> 
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="short" hidden>#</th>
              <th style={{width: "12%"}}>Login</th>
              <th style={{width: "11%"}}>Nome</th>
              <th style={{width: "20%"}}>Email</th>   
              <th style={{width: "8%"}}>Departamento</th>
              <th style={{width: "9%"}}>Nível de Acesso</th>
              <th style={{width: "3%"}}>Status</th>
              <th style={{width: "7%"}}>Idade Senha</th>
              <th style={{width: "7%"}}>Criado em</th>
              <th style={{width: "7%", textAlign: "center"}}>Recebe Email</th>
              <th style={{width: "7%", textAlign: "center"}}>Compartilhado</th>
              <th style={{width: "4%", textAlign: "center"}}>Editar</th>
              <th style={{width: "8%", textAlign: "center"}}>Alterar Senha</th>
              <th style={{width: "4%", textAlign: "center"}}>Excluir</th>
            </tr>
          </thead>
          <tbody className="">
              {users.map((user) => (
                <tr key={user.idUser}>
                  <td hidden>{user.idUser}</td>
                  <td>{user.login}</td>
                  <td>{user.nameComplete}</td>
                  <td>{user.email}</td> 
                  <td>{user.Department.department}</td>
                  <td>{user.Department.AccessLevel.accessLevel}</td>
                  <td>{user.Status.status}</td>
                  <td>
                    {calcularDiferencaEmDias(user.agePassword) >= 90 ? (
                      <span style={{ color: 'red', fontWeight: 'bold'}}> {calcularDiferencaEmDias(user.agePassword)} dias</span>
                    ) 
                      : 
                    (
                      <span style={{ color: 'green'}}> {calcularDiferencaEmDias(user.agePassword)} dias</span>
                    )}
                  </td>
                  <td>{converteData(user.createdAt)}</td>
                  <td style={{textAlign: "center"}}>
                    {user.sendEmail === 0 ? 
                      <img className="icon shared" src="../images/box-unchecked.png" alt="box-unchecked" /> : 
                      <img className="icon shared" src="../images/box-checked.png" alt="box-checked" />} 
                  </td>
                  <td style={{textAlign: "center"}}>
                    {user.sharedUser === 0 ? 
                      <img className="icon shared" src="../images/box-unchecked.png" alt="box-unchecked" /> : 
                      <img className="icon shared" src="../images/box-checked.png" alt="box-checked" />} 
                  </td>
                  <td style={{textAlign: "center"}}>
                    <img className="icon" src="../images/editar2.png" alt="editar2" 
                    onClick={() => handleEdit(user.idUser)} />
                  </td>
                  <td style={{textAlign: "center"}}>
                    <img className="icon" src="../images/senha2.png" alt="senha2"
                      onClick={() => handleChangePassword(user.idUser, user.login)} />
                  </td>
                  <td style={{textAlign: "center"}}>
                      {loogedUserLevel === "SuperUser" ? 
                      <img className="icon" src="../images/lixeira-com-tampa.png" alt="lixeira-com-tampa"
                      onClick={() => handleDelete(user.idUser, user.login)} /> :
                      <img className="icon disable" src="../images/lixeira-com-tampa-cinza.png" alt="lixeira-com-tampa"/>
                      }
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>      
      

      {/* //MODAL PARA ALTERAR A SENHA DO USUÁRIO */}
      <Modal
        login={selectedLogin}
        userId={selectedId}
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="custom-modal" // Classe personalizada para estilização
      >

        <h2>Alteração de senha</h2>
        <p>Digitar uma nova senha para <span>{selectedLogin}</span> </p>

        <div className="form-group">
          {/* //INPUT DA SENHA */}
          <input
            id="userpass"
            className="inp "
            type={typeofPassword}
            placeholder="Nova Senha"
            value={newPassword}
            onClick={(e) => setErrorSenhaClass("hidden")}
            onChange={(e) => setNewPassword(e.target.value)}
            form=""
          />
          <img className="eye" src={"../../images/olho-" + eyeSenha +  ".png"} alt="ver-senha" 
            onClick={(e) => {
              eyeSenha === "aberto" ? setEyeSenha("fechado") : setEyeSenha("aberto")
              typeofPassword === "password" ? setTypeofPassword("texto") : setTypeofPassword("password")
              }}
            />
          <div className={"error-message " + errorSenhaClass}>
            {errorSenha}
          </div>
        </div>

        {/* //INPUT DA CONFIRMAÇÃO DA SENHA */}
        <div className="form-group">
            <input
            id="userconfirmpass"
            className="inp "
            type={typeofRePassword}
            placeholder="Confirmação Senha"
            value={newPasswordConfirm}
            onClick={(e) => setErrorConfimSenhaClass("hidden")}
            onChange={(e) => {setNewPasswordConfirm(e.target.value); setSelectedId(selectedId); }}
          />
          <img className="eye" src={"../images/olho-aberto.png"} alt="erro" 
            onClick={(e) => {
              eyeReSenha === "aberto" ? setEyeReSenha("fechado") : setEyeReSenha("aberto")
              typeofRePassword === "password" ? setTypeofRePassword("texto") : setTypeofRePassword("password")
              }}
          />
          <div className={"error-message " + errorConfimSenhaClass}>
            {errorRedigiteSenha}
          </div>
        </div>

        <div className="forced">
          <p>Exigir troca de senha no próximo login</p>
          <input
            type="checkbox"
            checked={forceChange}
            onClick={() => setForceChange(!forceChange)} // Inverte o valor de forceChange
          />
        </div>

        {/* GERADOR DE SENHA */}
        <div className="gerador-senha">
        <button className="password Btn defaultBtn" type="button" onClick ={handlePassword}>Gerar senha</button>

          <input id="gerasenha" className="textPassword" value={password} readOnly />
          <img className="copy" src={"../../images/copy-branco.png"} alt=""
            onClick={() => {
              handleCopy();
              setErrorSenha("");
              setErrorSenhaClass("hidden")
              setErrorRedigiteSenha("");
              setErrorConfimSenhaClass("hidden");
            }}
          />
        </div>
        
        {/* BOTOÕES */}
        <div className="btn">
          <button className="Btn escBtn" onClick={closeModal}>Cancelar</button>
          <button className="Btn okBtn" onClick={handleSubmit}>Confirmar</button>
        </div>

        {/* INFO DA SENHA */}
        <div className="tips">A senha precisa ter <strong>8 caracteres</strong>  e conter ao menos: <br />
            1 letra <strong>minúscula</strong> , 1 letra <strong>maiúscula</strong>, 1 <strong>número</strong> e 1 <strong>caracter especial</strong>.
        </div>
      </Modal>

      {/* //MODAL PARA DELETAR O USUÁRIO */}
      <Modal
        className="custom-modal" // Classe personalizada para estilização
        login={selectedUserToDelete}
        userId={selectediDToDelete}
        isOpen={isDeleteModalOpen}
        onRequestClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUserToDelete(null);
        }}
      >
        <h2>Confirmar Exclusão</h2>

        <p>Tem certeza que deseja excluir o usuário <span>{selectedUserToDelete}</span> ?</p>

        <div className="btn">
          <button className="Btn escBtn" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
          <button className="Btn okBtn" onClick={() => handleDeleteUserConfirmed(selectediDToDelete)}>Confirmar</button>
        </div>

      </Modal>

          <div className={'msg ' + msgType}>{msg}</div>
    </section>
  )
};

export default CadastroUsuarios;