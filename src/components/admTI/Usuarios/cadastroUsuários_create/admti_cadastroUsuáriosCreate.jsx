import "./index.scss";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { checkLoginEmailCQ, createUser } from "../../../../services/apiLoginUser";
import validator from 'validator'
import { validadorSenha, generatePassword } from '../../../../functions/manipuladorSenhas';
import { validarFormatoDDMM } from '../../../../functions/manipuladorDataHora';


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
    const [codCQ, setCodCQ] = useState('');
    const [recebeEmail, setRecebeEmail] = useState("0");
    const [compart, setCompart] = useState("0");
    const [textSenha, setTextSenha] = useState("");
    const [textConfirmaSenha, setTextConfirmaSenha] = useState("");
    const [textBirthdate, setTextBirthdate] = useState("");
    
    //USESTATES DOS ERROS
    const [textErroLogin, setTextErroLogin] = useState("Login requerido");
    const [textErroEmail, setTextErroEmail] = useState("Email requerido");
    const [textErroNome, setTextErroNome] = useState("Nome requerido");
    const [textErroCQ, setTextErroCQ] = useState("");
    const [textErroAniversario, setTextErroAniversario] = useState("");
    const [textErroSenha, setTextErroSenha] = useState("Senha requerida");
    const [textErroConfirmSenha, setTextErroConfirmSenha] = useState("Confirmação requerida");

    //USESTATES DAS CLASSES DOS ERROS
    const [textErroLoginClass, setTextErroLoginClass] = useState("show");
    const [textErroEmailClass, setTextErroEmailClass] = useState("show");
    const [textErroNomeClass, setTextErroNomeClass] = useState("show");
    const [textErroAniversarioClass, setTextErroAniversarioClass] = useState("hidden");
    const [textErroCQClass, setTextErroCQClass] = useState("hidden");
    const [textErroSenhaClass, setTextErroSenhaClass] = useState("show");
    const [textErroConfirmSenhaClass, setTextErroConfirmSenhaClass] = useState("show");

    //USESTATES DE APOIO
    const [login, setLogin] = useState(false);
    const [passwd, setPasswd] = useState(false);
    const [email, setEmail] = useState(false);
    const [name, setName] = useState(false);
    const [senha, setSenha] = useState(false);
    const [aniversario, setAniversario] = useState(false);
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

    

    //FUNÇÃO QUE PEGA O DEPARTAMENTO E LIGA COM O NIVEL DE ACESSO Á CADA ALTERAÇÃO DO DEPPTO
    useEffect(() => {
      console.log(textLogin, textEmail, textName, depto,
                  nivel, status, codCQ,  recebeEmail, 
                  compart, textSenha, textConfirmaSenha, textBirthdate)
                }, [textLogin, textEmail, textName, depto,
                  nivel, status, codCQ,  recebeEmail, 
                  compart, textSenha, textConfirmaSenha, textBirthdate]);
  
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

      //VALIDA A VARIAVEL ANIVERSARIO 
      if(textBirthdate === "" || textName === undefined) {
        setAniversario(true)
      } else {
        if (!validarFormatoDDMM(textBirthdate)) {
          setTextErroAniversario("Formáto inválido");
          setTextErroAniversarioClass("show")
        } else {
          setAniversario(true)
        }
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
      if(login && name && email && passwd && aniversario) {

            //SE TUDO CERTO, VERIFICA NA API SE JÁ EXITE LOGIN E EMAIL OU CÓDIGO CQ
            setPasswd(false) //VOLTA A CONDIÇÃO PASSWD COMO FALSE (NÃO OK)
            try {
              const response = await checkLoginEmailCQ(textLogin, textEmail, codCQ );
              //SE JÁ EXISTE LOGIN OU EMAIL APRESENTA AS RESPECITIVAS MENSAGENS DE ERRO
              if(response.haveLogin || response.haveEmail || response.haveCodCQ){
                if(response.haveLogin){
                  setTextErroLogin("Login já existe");
                  setTextErroLoginClass("show")
                };
                if(response.haveEmail){
                  setTextErroEmail("Email já existe");
                  setTextErroEmailClass("show")
                };
                if(response.haveCodCQ){
                  setTextErroCQ("Código CQ já existe");
                  setTextErroCQClass("show")
                };

              // SE TUDO OK CHAMA A API QUE VAI GRAVAR OS DADOS NO BANCO
              } else {

                //CONVERTE SETOR E STATUS NOVAMENTE EM IDs
                const statusId = stattus.find(item => item.status === status)?.idStatus;
                const setorId = deptto.find(item => item.department === depto)?.idDept;

                const response = await createUser(textLogin, textName, textEmail, setorId, statusId, compart, recebeEmail, textSenha, codCQ);
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
                setCodCQ("");
                setTextBirthdate("");

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
      setPassword(generatePassword(passwordLength));
    };

    const handleCopy = () => {
      setTextSenha(password);
      setTextConfirmaSenha(password);
    };
    
    
    //RENDERIZAÇÃO DA PÁGINA ****************************************************
    return (
    <section className="cadastrarUsuarios">

      <h2>Inserir novo usuário</h2>

      <div className="content">
        
        <form className="form" onSubmit={handleSubmit}>
          
          <div className="bloco">
            
            <div className="ladoEsq">

                {/* Grupo Login */}
                <div className="form-group">
                  <label htmlFor="userlogin">Login: &emsp;</label>
                  <input id="userlogin" value={textLogin} type="text" onChange={(e) => {
                    setTextLogin(e.target.value); 
                    setTextErroLogin("");
                    setTextErroLoginClass("hidden")
                    }} />
                    <div className={"erros " + textErroLoginClass}>{textErroLogin}</div>
                </div>
                <div className="tips">O login precisa estar no formato: <strong> nome.outronome</strong>, <br />em <strong>minúsculas</strong> , <strong>sem espaços</strong>  e com um <strong>ponto separador</strong>.</div>

                {/* Grupo Email */}
                <div className="form-group">
                  <label htmlFor="useremail">Email: &emsp;</label>
                  <input id="useremail" value={textEmail} type="text" onChange={(e) => {
                    setTextEmail(e.target.value); 
                    setTextErroEmail("");
                    setTextErroEmailClass("hidden")
                    }} />
                  <div className={"erros " +  textErroEmailClass}>{textErroEmail}</div>
                </div> 

                {/* Grupo Nome */}
                <div className="form-group">
                  <label htmlFor="nome">Nome Completo: &emsp;</label>
                  <input id="nome" value={textName} type="text" onChange={(e) => {
                    setTextName(e.target.value); 
                    setTextErroNome("");
                    setTextErroNomeClass("hidden")
                    }} />
                  <div className={"erros " +  textErroNomeClass}>{textErroNome}</div>
                </div> 

                {/* Grupo Aniversário */}
                <div className="form-group">
                  <label htmlFor="aniversario">Aniversário: &emsp;</label>
                  <input id="aniversario" type="text" value={textBirthdate} onChange={(e) => {
                    setTextBirthdate(e.target.value);
                    setTextErroAniversario("");
                    setTextErroAniversarioClass("hidden");
                    }} />
                  <div className={"erros " +  textErroAniversarioClass}>{textErroAniversario}</div>
                </div> 
                <div className="tips">Usar o formato: <strong>dd/mm</strong>. SEM O ANO</div>

                {/* Grupo Senha */}
                <div className="form-group senha">
                  <label htmlFor="usersenha">Senha: &emsp;</label>
                  <div className="type-senha">
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
                  </div>
                  <div className={"erros " + textErroSenhaClass}>{textErroSenha}</div>
                </div> 

                {/* Grupo Confirma a Senha */}
                <div className="form-group confirmSenha">
                  <label htmlFor="confirmSenha">Confirme a Senha: &emsp;</label>
                  <div className="type-senha">
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
                  </div>
                  <div className={"erros " + textErroConfirmSenhaClass}>{textErroConfirmSenha}</div>
                </div> 
              <div className="tips">A senha precisa ter <strong>8 caracteres</strong>  e conter ao menos: <br />
              1 letra <strong>minúscula</strong> , 1 letra <strong>maiúscula</strong>, 1 <strong>número</strong> e 1 <strong>caracter especial</strong>.</div> 
                
            </div> {/* fecha o lado esquerdo */}

            <div className="ladoDir">

              {/* Grupo Departamento */}
              <div className="form-group">
                <label htmlFor="department">Departamento: &emsp;</label>
                <select id="department" name="department" onChange={(e) => setDepto(e.target.value)}>
                  {deptto.map((dept) => (
                    <option key={dept.department} value={dept.department}>
                      {dept.department}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grupo Status */}
              <div className="form-group">
                <label htmlFor="stattus">Status: &emsp;</label>
                <select id="stattus" name="stattus" onChange={(e) => setStatus(e.target.value)}>
                  {stattus.map((stt) => (
                    <option key={stt.status} value={stt.status}>
                      {stt.status}
                    </option>
                  ))}
                </select>
              </div> 

              {/* Grupo RecebeEmail */}
              <div className="form-group">
                <label htmlFor="recebeEmail">Recebe Email: &emsp;</label>
                <select id="recebeEmail" name="recebeEmail" onChange={(e) => setRecebeEmail(e.target.value === "Sim" ? 1 : 0)}>
                    <option>Não</option>
                    <option>Sim</option>
                  </select>
              </div>

              {/* Grupo Compartilhado */}
              <div className="form-group">
                <label htmlFor="compart">Compartilhado: &emsp;</label>
                <select id="compart" name="compart" onChange={(e) => setCompart(e.target.value === "Sim" ? 1 : 0)}>
                    <option>Não</option>
                    <option>Sim</option>
                  </select>
              </div> 

              {/* Grupo Nível de Acesso */}
              <div className="form-group">
                <label htmlFor="nivel">Nível de Acesso: &emsp;</label>
                <select className="desabilitado" name="nivel" id="nivel" value={nivel}>
                  <option>{nivel}</option>
                </select>
              </div> 

              {/* Grupo CQ */}
              <div className="form-group">
                  <label htmlFor="nivel">Código CQ: &emsp;</label>
                  <input id="nivel" type="text" value={codCQ} onChange={(e) => {
                    setCodCQ(e.target.value);
                    setTextErroCQ("");
                    setTextErroCQClass("hidden");
                    }} />
                </div> 

            </div>  {/* fecha o lado direito */}

          </div> {/* fecha AMBOS OS LADOS */}

          <hr />

          <div style={{display:"grid", gridTemplateColumns: "1fr 1fr", gap: '3rem'} }>

            <div className="ladoEsq">
              {/* GERADOR DE SENHA */}      
              <div className="form-group gerador">
                  <button className="defaultBtn inBtn" type="button" onClick ={handlePassword}>Gerar senha</button>
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
              </div>
            </div>

            <div className="ladoDir">
              <div className="form-group botoes">
                <button className="defaultBtn escBtn" type="button" onClick ={handleCancel}>Cancelar</button>
                <button className="defaultBtn okBtn" type="submit">Criar &emsp; <small style={{ color: 'black' }}>(Duplo clique)</small></button>
              </div> 
            </div>   
          </div>
                      
        </form>

      </div>
      <div className="form-group">
        <div className={'msg ' + msgType}>{msg}</div>
      </div>

      
    </section> 
  )
};

export default CadastroUsuariosCreate;