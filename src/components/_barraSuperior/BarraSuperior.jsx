import "./index.scss";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import { alterPassword, validPassword } from "../../services/apiLoginUser";
import { validadorSenha, generatePassword } from '../../functions/manipuladorSenhas';
import './modalStyles.scss'; // Importo estilos dos modais

function BarraSuperior() {

  const { logout, userLogged, dataAge, updateDataAge } = useContext(AuthContext);
  const navigate = useNavigate();

  const daysPwrdAlert = userLogged.settings[1].valueSet; //recupera do userLogged quantos dias antes vai emitir o alerta de senha expirando
  const maxAgePassword = userLogged.settings[0].valueSet; //recupera do userLogged qual idade máxima da senha

  //  MENSAGENS DE ERRO
  const [errorSenha, setErrorSenha] = useState("mensagem inicial");
  const [errorRedigiteSenha, setErrorRedigiteSenha] = useState("mensagem inicial");
  const [errorSenhaExpirada, setErrorSenhaExpirada] = useState("");
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
  const [forceChange] = useState(0);
  //CONTROLE DE VISIBILIDADE DA SENHA
  const [eyeSenha, setEyeSenha] = useState("aberto") //variavel para abrir ou fechar o olho
  const [typeofPassword, setTypeofPassword] = useState("password") //variavel para mudar o tipo de senha
  const [eyeReSenha, setEyeReSenha] = useState("aberto") //variavel para abrir ou fechar o olho
  const [typeofRePassword, setTypeofRePassword] = useState("password") //variavel para mudar o tipo de senha
  // VARIAVEIS AUXILIARES
  const [password, setPassword] = useState(""); //salva a senha criada no gerador de senhas
  const [passwordLength] = useState(8); //define o tamanho da senha
  const [modalClosed, setModalClosed] = useState(true); //altera o estado do botão fechar do MODAL
  const [newDataAge, setNewDataAge] = useState(dataAge); //reseta a idade da senha
  const [redirect, setRedirect] = useState(false); //controla o estado do botão cancela do modal => false só cancela, true redireciona

  var name = userLogged.logged.nameComplete.split(' '); //pega somente o primeiro nome do nome completo do usuário

  //chama a função de logout no context 
  const handleSubmit = () => {
      logout();
  }

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
    setEyeSenha("aberto")
    setEyeReSenha("aberto")
    setTypeofPassword("password")
    setTypeofRePassword("password")
    setErrorSenhaExpirada("");
    setModalClosed(true);
    setNewDataAge(maxAgePassword);
  };
  const redirectToLogin = () => {
    navigate("/");
  };

  // DEVOLVE PARA O CONTEXT A VARIVAL AGE DA SENHA ATUALIZADA
  useEffect(() => {
    updateDataAge(newDataAge)
  }, [newDataAge]);

  
  const handlePasswordSubmit = async () => {
    setRedirect(false); // define que o botão cancela só cancela o modal
    // Lógica para alterar a senha
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
      console.log(newPassword)
    } else if(!validadorSenha(newPassword)) {
      setErrorSenha("Formato Inválido");
      setErrorRedigiteSenha("Formato Inválido");
      setErrorSenhaClass("");
      setErrorConfimSenhaClass("");
    } else {
      
      const resp = await validPassword(selectedId, newPassword);

      if(!resp.validated)
      {
        setErrorSenha("Senha já usada");
        setErrorRedigiteSenha("Senha já usada");
        setErrorSenhaClass("");
        setErrorConfimSenhaClass("");
      }
      else
      {
        const response = await alterPassword(selectedId, newPassword, forceChange);
        setMsg(response.msg);
        if(response.msg_type === "success") {
          setMsgType("success");
        } else {
          setMsgType("error");
        }
        //LIMPA O FORMULÁRIO
        setNewPassword("");
        setNewPasswordConfirm("");
        // Define um atraso de 3 segundos (3000 milissegundos) para reverter para "hidden"  
        setTimeout(() => {
          setMsgType("hidden");
        }, 3000);
         closeModal();
      }
    }
  };

  /*FUNÇÃO GERADOR DE SENHA*/
  const handlePassword = () => {
    setPassword(generatePassword(passwordLength));
  };

  /*COPIA A SENHA GERADA DENTRO DO INPUT SENHA*/
  const handleCopy = () => {
    setNewPassword(password);
    setNewPasswordConfirm(password);
  }; //FIM DA ALTERAÇÃO DE SENHA 

  //VERIFICA SE A SENHA ESTÁ EXPIRADA OU O USUÁRIO TEM QUER TROCAR A SENHA - ABRE O MODAL DE TROCA DE SENHA
  useEffect(() => {
    if (dataAge <= 0) {
      handleChangePassword(userLogged.logged.idUser, userLogged.logged.login);
      setErrorSenhaExpirada(" - Senha Expirada");
      setModalClosed(false);
      setRedirect(true); // define que o botão cancela vai redirecionar para o "/"
    }
    if (userLogged.logged.forcedChangePassword === 1) {
      handleChangePassword(userLogged.logged.idUser, userLogged.logged.login);
      setModalClosed(false);
      setRedirect(true); // define que o botão cancela vai redirecionar para o "/"
    }
  }, []);

  return (
    <section className='barraSuperior'>
        <div className='logoTitulo'>
            <img className='logo' src='../../images/logoSulplastBranco.png' alt="logoSulplastBranco" />
            <h1>Sulplast Intranet</h1>
        </div>

        <div className='infoSair'>
            <div className='setor'>
                <h1>{userLogged.logged.Department.department}</h1>
                <h3>Nível de Acesso: {userLogged.logged.Department.AccessLevel.accessLevel}</h3>
            </div>
            <div className="divider"></div>
            <div className='user'>
                <p>Bem-vindo, <br />
                    <strong>{name[0].toUpperCase()}</strong>! <br />
                </p>
                <div
                className="errAgePswd"
                style={{ display: dataAge < daysPwrdAlert ? 'block' : 'none' }}
                ><strong> Senha Expira em: {dataAge} dias </strong></div>
                <div className="alter-pswd" onClick={() => handleChangePassword(userLogged.logged.idUser, userLogged.logged.login)} >
                    Alterar Senha 
                </div>
            </div>
            <div className="divider"></div>
            <div className='sair'>
                <button onClick={handleSubmit}>
                    <img src="../../images/sair.png" alt="sair" />
                    <p>Sair</p>
                </button>
            </div>
            
        </div>

{/* //MODAL PARA ALTERAR A SENHA DO USUÁRIO */}
<Modal
        login={selectedLogin}
        userId={selectedId}
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={modalClosed} // Evita o fechamento ao clicar fora do modal
        className="custom-modal" // Classe personalizada para estilização
      >

        <h2>Alteração de senha {errorSenhaExpirada}</h2>

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
            placeholder="Confirmação Nova Senha"
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

        <div className="inpCopy">
          <input id="gerasenha" className="textPassword" value={password} readOnly />
            <img className="copy" src={"../../images/copy-branco.png"} alt="copy-branco"
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
        
        <div className="btn">
          <button className="Btn escBtn" 
          onClick={
            redirect ? redirectToLogin : closeModal
          }>Cancelar</button>
          <button className="Btn okBtn" onClick={handlePasswordSubmit}>Confirmar</button>
        </div>

        <div className="tips">A senha precisa ter <strong>8 caracteres</strong>  e conter ao menos: <br />
            1 letra <strong>minúscula</strong> , 1 letra <strong>maiúscula</strong>, 1 <strong>número</strong> e 1 <strong>caracter especial</strong>.
        </div>

      </Modal>
      
      <div className={'msg ' + msgType}>{msg}</div>
    </section>
    
  )

}

export default BarraSuperior