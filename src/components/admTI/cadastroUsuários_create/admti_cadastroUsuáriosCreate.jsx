import "./index.scss";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { checkLoginEmail, createUser } from "../../../services/api";
import validator from 'validator'
import validadorSenha from '../../../functions/validadorSenha';
import geradorSenha from '../../../functions/geradorSenha';

const CadastroUsuariosCreate = ( props ) => {
    
    //PEGA OS PARÂMETROS PASSADOS PELA PROPS
    const deptto = props.userData.deptto;
    const stattus = props.userData.stattus;

    //INICIALIZA AS VARIAVEIS DEPPTO E STATTUS
    const initialDepartment = deptto.length > 0 ? deptto[0].department : "";
    const initialStattus = stattus.length > 0 ? stattus[0].status : "";

    const navigate = useNavigate();

    //USESTATES QUE RECEBEM OS DADOS DOS DADOS
    const [textLogin, setTextLogin] = useState("");
    const [textName, setTextName] = useState("");
    const [textEmail, setTextEmail] = useState("");
    const [depto, setDepto] = useState(initialDepartment);
    const [nivel, setNivel] = useState("");
    const [status, setStatus] = useState(initialStattus);
    const [recebeEmail, setRecebeEmail] = useState("0");
    const [compart, setCompart] = useState("0");
    const [textSenha, setTextSenha] = useState("");
    const [textConfirmaSenha, setTextConfirmaSenha] = useState("");
    
    //USESTATES DOS ERROS
    const [textErroLogin, setTextErroLogin] = useState("Login requerido");
    const [textErroEmail, setTextErroEmail] = useState("Email requerido");
    const [textErroNome, setTextErroNome] = useState("Nome requerido");
    const [textErroSenha, setTextErroSenha] = useState("Senha requerida");
    const [textErroConfirmSenha, setTextErroConfirmSenha] = useState("Confirmação de senha requerida");

    //USESTATES DAS CLASSES DOS ERROS
    const [textErroLoginClass, setTextErroLoginClass] = useState("show");
    const [textErroEmailClass, setTextErroEmailClass] = useState("show");
    const [textErroNomeClass, setTextErroNomeClass] = useState("show");
    const [textErroSenhaClass, setTextErroSenhaClass] = useState("show");
    const [textErroConfirmSenhaClass, setTextErroConfirmSenhaClass] = useState("show");

    //USESTATES DE APOIO
    const [login, setLogin] = useState(false);
    const [passwd, setPasswd] = useState(false);
    const [email, setEmail] = useState(false);
    const [name, setName] = useState(false);
    const [senha, setSenha] = useState(false);
    const [confirmaSenha, setConfirmaSenha] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordLength] = useState(8);
    
    //CONTROLE DE VISIBILIDADE DA SENHA
    const [eyeSenha, setEyeSenha] = useState("aberto") //variavel para abrir ou fechar o olho
    const [typeofPassword, setTypeofPassword] = useState("password") //variavel para mudar o tipo de senha
    const [eyeReSenha, setEyeReSenha] = useState("aberto") //variavel para abrir ou fechar o olho
    const [typeofRePassword, setTypeofRePassword] = useState("password") //variavel para mudar o tipo de senha
    const [msg, setMsg] = useState("mensagem inicial"); //MENSAGEM DE RETORNO DA API DO BANCO RODAPÉ
    const [msgType, setMsgType] = useState("hidden"); //MENSAGEM DE RETORNO DA API DO BANCO RODAPÉ

    //FUNÇÃO QUE PEGA O DEPARTAMENTO E LIGA COM O NIVEL DE ACESSO Á CADA ALTERAÇÃO DO DEPPTO
    useEffect(() => {
      // Encontrar o departamento correspondente no array
      const selectedDept = deptto.find((dept) => dept.department === depto);
      // Atualizar o estado do nível de acesso
      if (selectedDept) {
        setNivel(selectedDept.AccessLevel.accessLevel);
      }
    }, [depto, deptto]);
  
    //FUNÇÃO DO BOTÃO DE SUBMIT DO FORMULÁRIO
    const handleSubmit =  async (e) => {
      e.preventDefault(); //PREVINE A AÇÃO DEFULT DO FORMULÁRIO

      // Expressão regular para validar o formato xxxx.xxxx sem números
      var formatoLogin = /^[a-z]+(\.[a-z]+)+$/;

      //ESSE GRUPO VERIFICA OS CAMPOS REQUERIDOS E MOSTRA AS RESPECTIVAS MENSAGENS DE ERRO
      //VERIFICA SE ESTÁ PREENCHIDA A VARIÁVEL LOGIN
      if(textLogin === "" || textLogin === undefined) {
        setTextErroLogin("Login requerido");
        setTextErroLoginClass("show")
      } else if(!formatoLogin.test(textLogin)){
        setTextErroLogin("Formato inválido");
        setTextErroLoginClass("show")
      } else {
        setLogin(true);
      }

      //VERIFICA SE ESTÁ PREENCHIDA A VARIÁVEL EMAIL
      if(textEmail === "" || textEmail === undefined) {
        setTextErroEmail("Email requerido");
        setTextErroEmailClass("show")
      } else if(!validator.isEmail(textEmail)){
        setTextErroEmail("Formato inválido");
        setTextErroEmailClass("show")
      } else {
        setEmail(true)
      }
      
      //VERIFICA SE ESTÁ PREENCHIDA A VARIÁVEL NOME
      if(textName === "" || textName === undefined) {
        setTextErroNome("Nome requerido");
        setTextErroNomeClass("show")
      } else {
        setName(true)
      }

      //VERIFICA REGRAS DAS SENHAS
      //VERIFICA SE ESTÁ PREENCHIDA A VARIÁVEL SENHA
      if(textSenha === "" || textSenha === undefined) {
        setTextErroSenha("Senha requerida");
        setTextErroSenhaClass("show")
      } else {
        setSenha(true)
      }

      //VERIFICA REGRAS DAS SENHAS
      //VERIFICA SE ESTÁ PREENCHIDA A VARIÁVEL CONFIRMAÇÃO DE SENHA
      if(textConfirmaSenha === "" || textConfirmaSenha === undefined) {
        setTextErroConfirmSenha("Confirmação de senha requerida");
        setTextErroConfirmSenhaClass("show")
      } else {
       setConfirmaSenha(true)
      }
      
      //VERIFICA REGRAS DAS SENHAS
      //SE AMBAS ESTÃO PREENCHIDAS CONFIRMAÇÃO DE SENHA
      if(senha && confirmaSenha ){
        if(textConfirmaSenha !== textSenha){
          setTextErroSenha("Senhas não conferem");
          setTextErroConfirmSenha("Senhas não conferem");
          setTextErroConfirmSenhaClass("show")
          setTextErroSenhaClass("show")
        } else  if(!validadorSenha(textSenha)){
          setTextErroSenha("Formato de senha inválido");
          setTextErroConfirmSenha("Formato de senha inválido");
          setTextErroConfirmSenhaClass("show")
          setTextErroSenhaClass("show")
        } else{
          setPasswd(true)
        }
      }
      
      //ESSE GRUPO VERIFICA OS CAMPOS REQUERIDOS E REGRA DE SENHA
      if(login && name && email && passwd) {

            //SE TUDO CERTO, VERIFICA NA API SE JÁ EXITE LOGIN E EMAIL
            setPasswd(false) //VOLTA A CONDIÇÃO PASSWD COMO FALSE (NÃO OK)
            try {
              const response = await checkLoginEmail(textLogin, textEmail );
              //SE JÁ EXISTE LOGIN OU EMAIL APRESENTA AS RESPECITIVAS MENSAGENS DE ERRO
              if(response.login || response.email ){
                if(response.login){
                  setTextErroLogin("Login já existe");
                  setTextErroLoginClass("show")
                };
                if(response.email){
                  setTextErroEmail("Email já existe");
                  setTextErroEmailClass("show")
                };
              // SE TUDO OK CHAMA A API QUE VAI GRAVAR OS DADOS NO BANCO
              } else {

                //CONVERTE SETOR E STATUS NOVAMENTE EM IDs
                const statusId = stattus.find(item => item.status === status)?.idStatus;
                const setorId = deptto.find(item => item.department === depto)?.idDept;

                const response = await createUser(textLogin, textName, textEmail, setorId, statusId, compart, recebeEmail, textSenha);
                setMsg(response.msg)
                if(response.msg_type === "success") {
                  setMsgType("success")
                } else {
                  setMsgType("error")
                }

                //LIMPA O FORMULÁRIO
                setMsg(response.msg)
                setTextLogin("");
                setTextEmail("");
                setTextName("");
                setDepto(initialDepartment);
                setStatus(initialStattus)
                setRecebeEmail("0");
                setCompart("0");
                setTextSenha("");
                setTextConfirmaSenha("");

                // Define um atraso de 3 segundos (3000 milissegundos) para reverter para "hidden"  
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

    /*FUNÇÃO GERADOR DE SENHA*/
    const handlePassword = () => {
      setPassword(geradorSenha(passwordLength));
    };

    const handleCopy = () => {
      setTextSenha(password);
      setTextConfirmaSenha(password);
    };
    
    
    //RENDERIZAÇÃO DA PÁGINA ****************************************************
    return (
    <section className="cadastrarUsuarios">

      <h2>Inserir Novo Usuário</h2>
      <hr />

      <div className="content">
      <form className="form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="userlogin">Login: &emsp;</label>
          <input id="userlogin" value={textLogin} type="text" onChange={(e) => {
            setTextLogin(e.target.value); 
            setTextErroLogin("");
            setTextErroLoginClass("hidden")
            }} />
          <div className={"erros " + textErroLoginClass}>{textErroLogin}</div>
        </div> 

        <div className="tips">O login precisa estar no formato: <strong> nome.outronome</strong>, em <strong>minúsculas</strong> , <strong>sem espaços</strong>  e com um <strong>ponto separador</strong> .</div>

        <div className="form-group">
          <label htmlFor="useremail">Email: &emsp;</label>
          <input id="useremail" value={textEmail} type="text" onChange={(e) => {
            setTextEmail(e.target.value); 
            setTextErroEmail("");
            setTextErroEmailClass("hidden")
            }} />
          <div className={"erros " +  textErroEmailClass}>{textErroEmail}</div>
        </div> 

        <div className="form-group">
          <label htmlFor="nome">Nome Completo: &emsp;</label>
          <input id="nome" value={textName} type="text" onChange={(e) => {
            setTextName(e.target.value); 
            setTextErroNome("");
            setTextErroNomeClass("hidden")
            }} />
          <div className={"erros " +  textErroNomeClass}>{textErroNome}</div>
        </div> 

        <div className="form-group"p>
          <label htmlFor="department">Departamento: &emsp;</label>
          <select id="department" name="department" onChange={(e) => setDepto(e.target.value)}>
            {deptto.map((dept) => (
              <option key={dept.department} value={dept.department}>
                {dept.department}
              </option>
            ))}
          </select>
          <div className="erros none"></div>
        </div> 

        <div className="form-group">
          <label htmlFor="stattus">Status: &emsp;</label>
            <select id="stattus" name="stattus" onChange={(e) => setStatus(e.target.value)}>
              {stattus.map((stt) => (
                <option key={stt.status} value={stt.status}>
                  {stt.status}
                </option>
              ))}
            </select>
          <div className="erros none"></div>
        </div> 

        <div className="form-group">
          <label htmlFor="recebeEmail">Recebe Email: &emsp;</label>
          <select id="recebeEmail" name="recebeEmail" onChange={(e) => setRecebeEmail(e.target.value === "Sim" ? 1 : 0)}>
              <option>Não</option>
              <option>Sim</option>
            </select>
        <div className="erros none"></div>
        </div>

        <div className="form-group">
          <label htmlFor="compart">Compartilhado: &emsp;</label>
          <select id="compart" name="compart" onChange={(e) => setCompart(e.target.value === "Sim" ? 1 : 0)}>
              <option>Não</option>
              <option>Sim</option>
            </select>
        <div className="erros none"></div>
        </div> 

        <div className="form-group">
          <label htmlFor="nivel">Nível de Acesso: &emsp;</label>
          <input id="nivel" className="desabilitado" type="text" value={nivel} readOnly onChange={(e) => setNivel(e.target.value)} />
          <div className="erros none"></div>
        </div> 

        {/* //INPUT DA SENHA */}
        <div className="form-group">
          <label htmlFor="usersenha">Senha: &emsp;</label>
          <input 
          id="usersenha"
            value={textSenha}
            type={typeofPassword}
            onChange={(e) => {
              setTextSenha(e.target.value);
              setTextErroSenha("");
              setTextErroSenhaClass("hidden")
            }}
          />
          <img className="eye" src={"../../images/olho-" + eyeSenha +  ".png"} alt=""
          onClick={(e) => {
            eyeSenha === "aberto" ? setEyeSenha("fechado") : setEyeSenha("aberto")
            typeofPassword === "password" ? setTypeofPassword("texto") : setTypeofPassword("password")
            }}
          />
          <div className={"erros " + textErroSenhaClass}>{textErroSenha}</div>
        </div> 

        {/* //INPUT DA CONFIRMAÇÃO DA SENHA */}
        <div className="form-group">
          <label htmlFor="confirmSenha">Confirme a Senha: &emsp;</label>
          <input
            id="confirmSenha"
            value={textConfirmaSenha}
            type={typeofRePassword}
            onChange={(e) => {
              setTextConfirmaSenha(e.target.value); 
              setTextErroConfirmSenha("");
              setTextErroConfirmSenhaClass("hidden")
            }} />
          <img className="eye" src={"../../images/olho-" + eyeReSenha +  ".png"} alt=""
            onClick={(e) => {
              eyeReSenha === "aberto" ? setEyeReSenha("fechado") : setEyeReSenha("aberto")
              typeofRePassword === "password" ? setTypeofRePassword("texto") : setTypeofRePassword("password")
              }}
          />
          <div className={"erros " + textErroConfirmSenhaClass}>{textErroConfirmSenha}</div>
        </div> 
        <div className="tips">A senha precisa ter <strong>8 caracteres</strong>  e conter ao menos: <br />
        1 letra <strong>minúscula</strong> , 1 letra <strong>maiúscula</strong>, 1 <strong>número</strong> e 1 <strong>caracter especial</strong>.</div>

        <div className="form-group">
          <button className="Btn defaultBtn" type="button" onClick ={handlePassword}>Gerar senha</button>
          <input id="gerarSenha" className="textPassword" type="text" value={password} readOnly />
          <img className="copy" src={"../../images/copy.png"} alt=""
            onClick={() => {
              handleCopy();
              setTextErroSenha("");
              setTextErroSenhaClass("hidden")
              setTextErroConfirmSenha("");
              setTextErroConfirmSenhaClass("hidden");
            }}
            
          />
        {/*           <div className="radio-block">
            <input
              className="radio"
              type="radio"
              name="opcao"
              value="8"
              checked={passwordLength === 8}
              onChange={handleRadioChange}
            />8&emsp;&emsp;
            <input
              className="radio"
              type="radio"
              name="opcao"
              value="12"
              checked={passwordLength === 12}
              onChange={handleRadioChange}
            />12
          </div> */}

        </div>
          
        <div className="form-group">
          <button className="escBtn Btn" type="button" onClick ={handleCancel}>Cancelar</button>
          <button className="okBtn Btn" type="submit">Criar &emsp; <small style={{ color: 'black' }}>(Duplo clique)</small></button>
        </div>  

        <div className="form-group">
          <div className={'msg ' + msgType}>{msg}</div>
        </div>
                    
        </form>

      </div>
      
    </section> 
  )
};

export default CadastroUsuariosCreate;