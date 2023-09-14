import "./index.scss";
import { findUsers, editUser, depptoStatus, alterPassword, validPassword, deleteUser } from "../../../services/api";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/auth';
import validadorSenha from '../../../functions/validadorSenha';
import geradorSenha from '../../../functions/geradorSenha';
import calcularDiferencaEmDias from '../../../functions/calculaIdadeSenha';
import './modalStyles.scss'; // Importo estilos dos modais
Modal.setAppElement('#root'); 

const CadastroUsuarios =  () => {

  const { user, dataAge, updateDataAge } = useContext(AuthContext);
  const navigate = useNavigate();
  const loogedUserLevel = user.accessLevel;

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
  //  MODAL PARA DELETAR USUÁRIO
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);
  const [selectediDToDelete, setSelectediDToDelete] = useState(null);
  // VARIAVEIS AUXILIARES
  const [control, setControl] = useState(false) //variavel para controle de recarregar a página qdo excluido o usuário
  const [password, setPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(8);
  const [newDataAge, setNewDataAge] = useState(dataAge);
  //CONTROLE DE VISIBILIDADE DA SENHA
  const [eyeSenha, setEyeSenha] = useState("aberto") //variavel para abrir ou fechar o olho
  const [typeofPassword, setTypeofPassword] = useState("password") //variavel para mudar o tipo de senha
  const [eyeReSenha, setEyeReSenha] = useState("aberto") //variavel para abrir ou fechar o olho
  const [typeofRePassword, setTypeofRePassword] = useState("password") //variavel para mudar o tipo de senha

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
  }, [control]);

  // DEVOLVE PARA O CONTEXT A VARIVAL AGE DA SENHA ATUALIZADA
  useEffect(() => {
    updateDataAge(newDataAge)
  }, [newDataAge]);

  useEffect(() => {
  }, [users]);

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
      // Lógica para deletar o usuário aqui
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
        const response = await alterPassword(selectedId, newPassword);
        setMsg(response.msg);
        
        if(response.msg_type === "success")
        {
          setMsgType("success");
          //LIMPA O FORMULÁRIO
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

    return (
    <section className="cadastroUsuarios">
      <div className="titulo">
        <div></div>
        <h2>Usuários</h2>
        <button className="Btn defaultBtn" type="button" onClick ={handleNew}>Novo Usuário</button>
      </div>
      
      <hr />

      <table className="table table-striped">
        <thead>
          <tr>
            <th className="short">#</th>
            <th>Nome</th>
            <th>Login</th>
            <th>Email</th>   
            <th>Departamento</th>
            <th>Nível de Acesso</th>
            <th className="short">Status</th>
            <th className="short">Idade Senha</th>
            <th className="short">Recebe Email</th>
            <th className="short">Compartilhado</th>
            <th className="short">Editar</th>
            <th className="short">Alterar Senha</th>
            <th className="short">Excluir</th>
          </tr>
        </thead>
        <tbody>
            {/* Renderize os usuários no componente */}
            {users.map((user) => (
              <tr key={user.idUser}>
                <td className="short">{user.idUser}</td>
                <td>{user.nameComplete}</td>
                <td>{user.login}</td>
                <td>{user.email}</td> 
                <td>{user.Department.department}</td>
                <td>{user.Department.AccessLevel.accessLevel}</td>
                <td className="short">{user.Status.status}</td>
                <td className="short">
                  {calcularDiferencaEmDias(user.agePassword) >= 90 ? (
                    <span style={{ color: 'red', fontWeight: 'bold'}}> {calcularDiferencaEmDias(user.agePassword)} dias</span>
                  ) 
                    : 
                  (
                    <span style={{ color: 'green'}}> {calcularDiferencaEmDias(user.agePassword)} dias</span>
                  )}
                </td>
                <td className="short">
                  {user.sendEmail === 0 ? 
                    <img className="icon shared" src="../images/box-unchecked.png" alt="box-unchecked" /> : 
                    <img className="icon shared" src="../images/box-checked.png" alt="box-checked" />} 
                </td>
                <td className="short">
                  {user.sharedUser === 0 ? 
                    <img className="icon shared" src="../images/box-unchecked.png" alt="box-unchecked" /> : 
                    <img className="icon shared" src="../images/box-checked.png" alt="box-checked" />} 
                </td>
                <td className="short">
                  <img className="icon" src="../images/editar2.png" alt="editar2" 
                  onClick={() => handleEdit(user.idUser)} />
                </td>
                <td className="short">
                  <img className="icon" src="../images/senha2.png" alt="senha2"
                    onClick={() => handleChangePassword(user.idUser, user.login)} />
                </td>
                <td className="short">
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
          <img className="eye" src={"../../images/olho-" + eyeSenha +  ".png"} alt="" 
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
        
        <div className="btn">
          <button className="Btn escBtn" onClick={closeModal}>Cancelar</button>
          <button className="Btn okBtn" onClick={handleSubmit}>Confirmar</button>
        </div>

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