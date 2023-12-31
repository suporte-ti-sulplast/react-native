import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { findUsers, editUser, alterPassword, validPassword, deleteUser, searchUsers} from "../../../../services/apiLoginUser";
import { depptoStatus } from "../../../../services/apiMASTER";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from '../../../../contexts/auth';
import { converteData } from "../../../../functions/manipuladorDataHora";
import { validadorSenha, generatePassword, calcularDiferencaEmDias } from '../../../../functions/manipuladorSenhas';
import './modalStylesUsers.scss'; // Importo estilos dos modais

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

  /* RENDERIZAÇÃO DA PÁGINA ********************************************************* */
    return (
    <section className="cadastroUsuarios">
      {/* Titulo e botão novo */}
      <div className="subTitulo">
        <h2>Usuários</h2>
          <div className="botoes">
            <button className="defaultBtn inBtn" type="button" onClick ={handleNew}>Novo usuário</button>          
          </div>
      </div>
      
      <div className="tabela"> 
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="short" hidden>#</th>
              <th style={{ textAlign: "center"}}>Editar</th>
              <th style={{ textAlign: "center"}}>Senha</th>
              <th style={{ textAlign: "center", display: (loogedUserLevel === "SuperUser" ? "" : "none")}}>Excluir</th>
              <th >Nome</th>
              <th >Login</th>
              <th >Email</th>   
              <th >Departamento</th>
              <th >Nível de acesso</th>
              <th style={{ textAlign: "center"}}>Código etiqueta</th>
              <th >Status</th>
              <th style={{ textAlign: "center"}}>Aniversário</th>
              <th style={{ textAlign: "center"}}>Idade senha</th>
              <th >Criado em</th>
              <th style={{ textAlign: "center"}}>Recebe e-mail</th>
              <th style={{ textAlign: "center"}}>Compartilhado</th>

            </tr>
          </thead>
          <tbody className="tbody">
              {users.map((user) => (
                <tr key={user.idUser}>
                  <td hidden>{user.idUser}</td>
                  <td style={{textAlign: "center"}}>
                    <img className="icon" src="../images/editar2.png" alt="editar2" 
                    onClick={() => handleEdit(user.idUser)} />
                  </td>
                  <td style={{textAlign: "center"}}>
                    <img className="icon" src="../images/senha2.png" alt="senha2"
                      onClick={() => handleChangePassword(user.idUser, user.login)} />
                  </td>
                  <td style={{textAlign: "center", display: (loogedUserLevel === "SuperUser" ? "" : "none")}}>
                      <img className="icon lixeira" src="../images/lixeira-com-tampa.png" alt="lixeira-com-tampa"
                      onClick={() => handleDelete(user.idUser, user.login)} /> 
                  </td>
                  <td>{user.login}</td>
                  <td>{user.nameComplete}</td>
                  <td>{user.email}</td> 
                  <td>{user.Department.department}</td>
                  <td>{user.Department.AccessLevel.accessLevel}</td>
                  <td style={{ textAlign: "center"}}>{user.codCQ}</td>
                  <td>{user.Status.status}</td>
                  <td style={{ textAlign: "center"}}>{user.birthdate}</td>
                  <td style={{ textAlign: "center"}}>
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
        className="custom-modal-users" // Classe personalizada para estilização
      >

        <h2>Alteração de senha</h2>
        <p>Digitar uma nova senha para <span>{selectedLogin}</span> </p>

        <div className="form-group">
          <div className="type-senha">
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
          </div>
          <div className={"error-message " + errorSenhaClass}>
            {errorSenha}
          </div>
        </div>

        {/* //INPUT DA CONFIRMAÇÃO DA SENHA */}
        <div className="form-group">
          <div className="type-senha">
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
          </div>
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
        <button className="password defaultBtn inBtn" type="button" onClick ={handlePassword}>Gerar senha</button>
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
        <div className="botoes">
          <button className="defaultBtn escBtn" onClick={closeModal}>Cancelar</button>
          <button className="defaultBtn okBtn" onClick={handleSubmit}>Confirmar</button>
        </div>

        {/* INFO DA SENHA */}
        <div className="tips">A senha precisa ter <strong>8 caracteres</strong>  e conter ao menos: <br />
            1 letra <strong>minúscula</strong> , 1 letra <strong>maiúscula</strong>, 1 <strong>número</strong> e 1 <strong>caracter especial</strong>.
        </div>
      </Modal>

      {/* //MODAL PARA DELETAR O USUÁRIO */}
      <Modal
        className="custom-modal-users" // Classe personalizada para estilização
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