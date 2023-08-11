import "./index.scss";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { checkLoginEmail, createUser } from "../../../services/api";

const CadastroUsuariosCreate = ( props ) => {
    
    //PEGA OS PARÂMETROS PASSADOS PELA PROPS
    const deptto = props.userData.deptto;
    const stattus = props.userData.stattus;

    //INICIALIZA AS VARIAVEIS DEPPTO E STATTUS
    const initialDepartment = deptto.length > 0 ? deptto[0].department : "";
    const initialStattus = stattus.length > 0 ? stattus[0].status : "";

    const navigate = useNavigate();

    //USESTATES DOS DADOS
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [login, setLogin] = useState("");
    const [depto, setDepto] = useState(initialDepartment);
    const [nivel, setNivel] = useState("");
    const [status, setStatus] = useState(initialStattus);
    const [compart, setCompart] = useState("0");
    const [senha, setSenha] = useState("");
    const [redigiteSenha, setRedigiteSenha] = useState("");
    //USESTATES DOS ERROS
    const [errorLogin, setErrorLogin] = useState("");
    const [errorName, setErrorName] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorSenha, setErrorSenha] = useState("");
    const [errorRedigiteSenha, setErrorRedigiteSenha] = useState("");
    const [msgType, setMsgType] = useState("hidden");
    //USESTATES DE APOIO
    const [passwd, setPasswd] = useState(false);
    const [msg, setMsg] = useState("mensagem inicial");

    //FUNÇÃO QUE PEGA O DEPARTAMENTO E LIGA COM O NIVEL DE ACESSO Á CADA ALTERAÇÃO DO DEPPTO
    useEffect(() => {
      // Encontrar o departamento correspondente no array
      const selectedDept = deptto.find((dept) => dept.department === depto);
      // Atualizar o estado do nível de acesso
      if (selectedDept) {
        setNivel(selectedDept.AccessLevel.accessLevel);
      }
    }, [depto]);
  
    //FUNÇÃO DO BOTÃO DE SUBMIT DO FORMULÁRIO
    const handleSubmit =  async (e) => {
      e.preventDefault(); //PREVINE A AÇÃO DEFULT DO FORMULÁRIO

      //ESSE GRUPO VERIFICA OS CAMPOS REQUERIDOS E MOSTRA AS RESPECTIVAS MENSAGENS DE ERRO
      //VERIFICA SE ESTÁ PREENCHIDA A VARIÁVEL LOGIN
      if(login === "" || login === undefined) {
        setErrorLogin("error-message-login");
        setLogin("Login requerido");
      }
      //VERIFICA SE ESTÁ PREENCHIDA A VARIÁVEL NOME
      if(name === "" || name === undefined) {
        setErrorName("error-message-name");
        setName("Nome completo requerido");
      }
      //VERIFICA SE ESTÁ PREENCHIDA A VARIÁVEL EMAIL
      if(email === "" || email === undefined) {
        setErrorEmail("error-message-email");
        setEmail("Email requerido");
      }

      //VERIFICA REGRAS DAS SENHAS
      //VERIFICA SE ESTÁ PREENCHIDA AS VARIÁVEIS SENHA E CONFIRMÇÃO DE SENHA
      if( senha === "" || senha === undefined || redigiteSenha === "" || redigiteSenha === undefined ) { 
        setErrorSenha("error-message-senha");
        setErrorRedigiteSenha("error-message-redigite-senha");
        setSenha("Senha requerido");
        setRedigiteSenha("Confirmação requerida");
      //CASO AMBAS ESTEJAM PREENCHIDAS, VERIFICA SE SÃO IGUAIS
      } else  if (senha !== redigiteSenha){
        setErrorSenha("error-message-senha");
        setErrorRedigiteSenha("error-message-redigite-senha");
        setSenha("Senhas não conferem");
        setRedigiteSenha("Senhas não conferem ");
      //SE ESTÃO PREENCHIDAS E SÃO IGUAIS SETA A VARIAVEL PASSWD COMO TRUE (TUDO OK)
      } else {
        setPasswd(true)
      }
      
      //ESSE GRUPO VERIFICA OS CAMPOS REQUERIDOS E REGRA DE SENHA
      if(login !=="" &&
          login !=="Login requerido" &&
          name !=="" &&
          name !=="Nome completo requerido" &&
          email !=="" &&
          email !=="Email requerido" &&
          passwd) {
            //SE TUDO CERTO, VERIFICA NA API SE JÁ EXITE LOGIN E EMAIL
            setPasswd(false) //VOLTA A CONDIÇÃO PASSWD COMO FALSE (NÃO OK)
            try {
              const response = await checkLoginEmail(login,email );
              //SE JÁ EXISTE LOGIN OU EMAIL APRESENTA AS RESPECITIVAS MENSAGENS DE ERRO
              if(response.login || response.email ){
                if(response.login){
                  setErrorLogin("error-message-login");
                  setLogin("Login existente");
                };
                if(response.email){
                  setErrorEmail("error-message-email");
                  setEmail("Email existente");
                };
              // SE TUDO OK CHAMA A API QUE VAI GRAVAR OS DADOS NO BANCO
              } else {

                //CONVERTE SETOR E STATUS NOVAMENTE EM IDs
                const statusId = stattus.find(item => item.status === status)?.idStatus;
                const setorId = deptto.find(item => item.department === depto)?.idDept;
                
                const response = await createUser(login, name, email, setorId, statusId, compart, senha);
                setMsg(response.msg)
                if(response.msg_type === "success") {
                  setMsgType("success")
                } else {
                  setMsgType("error")
                }

                // Define um atraso de 5 segundos (5000 milissegundos) para reverter para "hidden"


                setMsg(response.msg)
                setLogin("");
                setEmail("");
                setName("");
                setDepto(initialDepartment);
                setStatus(initialStattus)
                setCompart("0");
                setSenha("");
                setRedigiteSenha("");

                setTimeout(() => {
                  setMsgType("hidden");
                }, 3000);

              };
            } catch (err) {
              console.error('Ocorreu um erro durante a consulta:', err);
            };         
      };
    };

    /* FUNÇÃO DO BOTÃO CANCELAR ... VOLTA PARA LISTA DE USERS */
    const handleCancel = (e) => {
      navigate("/ADM-TI/cadastro-usuarios"); 
    }
    
    //RENDERIZAÇÃO DA PÁGINA
    return (
    <section className="cadastrarUsuarios">

      <h2>Inserir Novo Usuário</h2>
      <hr />

      <form className="form" onSubmit={handleSubmit}>

        <form-group>
            <label htmlFor="">Login: &emsp;</label>
            <input className={errorLogin} type="text" value={login}  onClick={(e) => {setErrorLogin(""); setLogin("")}} onChange={(e) => setLogin(e.target.value)} />
        </form-group>

        <form-group>
          <label htmlFor="">Email: &emsp;</label>
          <input className={errorEmail} type="text" value={email}  onClick={(e) => {setErrorEmail(""); setEmail("")}} onChange={(e) => setEmail(e.target.value)} />
        </form-group>

        <form-group>
          <label htmlFor="">Nome Completo: &emsp;</label>
          <input className={errorName} type="text" value={name}  onClick={(e) => {setErrorName(""); setName("")}} onChange={(e) => setName(e.target.value)} />
        </form-group>
        
        <form-group>
          <label htmlFor="">Departamento: &emsp;</label>
          <select id="department" name="department" onChange={(e) => setDepto(e.target.value)}>
            {deptto.map((dept) => (
              <option key={dept.department} value={dept.department}>
                {dept.department}
              </option>
            ))}
          </select>
        </form-group>
        
        <form-group>
          <label htmlFor="">Status: &emsp;</label>
            <select id="stattus" name="stattus" onChange={(e) => setStatus(e.target.value)}>
              {stattus.map((stt) => (
                <option key={stt.status} value={stt.status}>
                  {stt.status}
                </option>
              ))}
            </select>
        </form-group>
        
        <form-group>
          <label htmlFor="">Compartilhado: &emsp;</label>
          <select id="department" name="department" onChange={(e) => setCompart(e.target.value === "Sim" ? 1 : 0)}>
              <option>Não</option>
              <option>Sim</option>
            </select>
        </form-group>

        <form-group >
          <label htmlFor="">Nível de Acesso: &emsp;</label>
          <input className="desabilitado" type="text" value={nivel} readOnly onChange={(e) => setNivel(e.target.value)} />
        </form-group>

        <form-group >
          <label htmlFor="">Senha: &emsp;</label>
          <input className={errorSenha} type="text" value={senha}  onClick={(e) => {setErrorSenha(""); setSenha("")}} onChange={(e) => setSenha(e.target.value)} />
        </form-group>

        <form-group >
          <label htmlFor="">Confirme a Senha: &emsp;</label>
          <input className={errorRedigiteSenha} type="text" value={redigiteSenha}  onClick={(e) => {setErrorRedigiteSenha(""); setRedigiteSenha("")}} onChange={(e) => setRedigiteSenha(e.target.value)} />
        </form-group>
        
        <form-group>
          <button className="defaultBtn esc" type="button" onClick ={handleCancel}>Cancelar</button>
          <button className="defaultBtn confirm" type="submit">Criar &emsp; <small style={{ color: 'black' }}>(Duplo clique)</small></button>
        </form-group>    

        <form-group>
          <div className={'msg ' + msgType}>{msg}</div>
        </form-group>
                     
      </form>
      
    </section> 
  )
};

export default CadastroUsuariosCreate;