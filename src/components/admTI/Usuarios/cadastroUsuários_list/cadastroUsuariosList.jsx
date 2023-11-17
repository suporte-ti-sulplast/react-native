import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import './modalStyles.scss'; // Importo estilos dos modais
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { findUsers, editUser, alterPassword, validPassword, deleteUser, searchUsers} from "../../../../services/apiLoginUser";
import { depptoStatus } from "../../../../services/apiMASTER";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from '../../../../contexts/auth';
import { converteData } from "../../../../functions/manipuladorDataHora";
import { validadorSenha, generatePassword, calcularDiferencaEmDias } from '../../../../functions/manipuladorSenhas';

Modal.setAppElement('#root'); 

const CadastroUsuarios =  () => {

  const navigate = useNavigate();
  const { dataAge, updateDataAge, userLogged, deptto, stattus, levvel } = useContext(AuthContext);
  const loogedUserLevel = userLogged.logged.Department.AccessLevel.accessLevel;

  const depptto = deptto;
  const sttattus = stattus;
  const level = levvel;
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
    coq: "",
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
        const response = await findUsers();
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
    console.log(users)
  }, [control, reset]);

  // DEVOLVE PARA O CONTEXT A VARIAVEL AGE DA SENHA ATUALIZADA
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
        console.error("Ocorreu um erro ao obter os dados", error);
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
      setErrorSenha("Formato inválido");
      setErrorRedigiteSenha("Formato inválido");
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
  };  //FIM DA ALTERAÇÃO DE SENHA *****************************************************************************

  /*FUNÇÃO GERADOR DE SENHA*/
  const handlePassword = () => {
    setPassword(generatePassword(passwordLength));
  };
  
  /* FUNÇÃO DO BOTÃO NOVO ... VAI PARA TELA DE NOVO USUÁRIO*/
  const handleNew = (e) => {
    const getDepptoStattus = async () => {
      try {
        const depptoStattus = await depptoStatus();
        navigate("/ADM-TI/cadastro-usuarios/create", {state: depptoStattus  });         
        } catch (error) {
          console.error("Ocorreu um erro ao obter os dados", error);
        }
      };
      getDepptoStattus();
  }

  /* MOSTRA AS CAIXAS DE FILTROS */
  const handleFilterShow = () => {
    setFilterHidden(!filterHidden);
  };

  /* LIMPA OS FILTROS E RECARREGA A LIST */
  const handleClear = () => {
    setReset(!reset)
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
        coq: "",
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
        const response = await searchUsers(filter);
        const usersDataSearche = response.data.users;
        setUsers(usersDataSearche);  
        setLoading(false);
        setControl(false)
      } catch (err) {
        console.error('Ocorreu um erro durante a consulta:', err);
        setLoading(false);
      }
  };

    return (
    <section className="cadastroUsuarios">
      {/* Titulo e botão novo */}
      <div className="titulo">
        <h2>Usuários</h2>
        <button className="Btn defaultBtn" type="button" onClick ={handleNew}>Novo Usuário</button>
      </div>

      <form action="" className="filtro">
          {/* FITROS */}
          <div className="btn-filtros" onClick={() => handleFilterShow()}> 
            <p><strong>FILTROS  </strong></p>
          </div> 

          <hr style={{marginBottom: "1rem"}} className={"linha" + (filterHidden ? "filterHidden" : "")}/>

          <div className={"linha" + (filterHidden ? "filterHidden" : "")}>
            
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
                <label htmlFor="nivel">Nível de acesso</label>
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
                <label htmlFor="coq">Cód CQ</label>
                <input
                  type="text"
                  name="coq"
                  value={filter.coq}
                  id="coq" 
                  onChange={(e) => {
                    setFilter((prevState) => ({
                      ...prevState,
                      coq: e.target.value
                    }));
                    setHaveSearch("1");
                  }} 
                />
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
                  <label htmlFor="data">Data criação</label>
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
                  <label htmlFor="sendEmail">Recebe e-mail</label>
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
      
      <hr />
      
      <div className="tabela"> 
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="short" hidden>#</th>
              <th >Nome</th>
              <th >Login</th>
              <th >Email</th>   
              <th >Departamento</th>
              <th >Nível de acesso</th>
              <th >CQ</th>
              <th >Status</th>
              <th >Aniversário</th>
              <th >Idade senha</th>
              <th >Criado em</th>
              <th style={{ textAlign: "center"}}>Recebe e-mail</th>
              <th style={{ textAlign: "center"}}>Compartilhado</th>
              <th style={{ textAlign: "center"}}>Editar</th>
              <th style={{ textAlign: "center"}}>Alterar senha</th>
              <th style={{ textAlign: "center"}}>Excluir</th>
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
                  <td>{user.codCQ}</td>
                  <td>{user.Status.status}</td>
                  <td>{user.birthdate}</td>
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
          <div className="inpCopy">
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