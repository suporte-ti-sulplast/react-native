import "./index.scss";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { checkLoginEmailCQ, updateUser } from "../../../../services/apiLoginUser";
import validator from 'validator'

const CadastroUsuariosEdit = ( props ) => {

  const navigate = useNavigate();

  const user = props.userData.userData.user;
  const deptto = props.userData.depptoStatus.deptto;
  const stattus = props.userData.depptoStatus.stattus;

  //USESTATES QUE RECEBEM OS DADOS DOS DADOS
  const [userId, setUserId] = useState("");
  const [textLogin, setTextLogin] = useState("");
  const [textName, setTextName] = useState("");
  const [textEmail, setTextEmail] = useState("");
  const [login, setLogin] = useState("");
  const [depto, setDepto] = useState("");
  const [status, setStatus] = useState("");
  const [codCQ, setCodCQ] = useState('');
  const [nivel, setNivel] = useState("");
  const [recebeEmail, setRecebeEmail] = useState("0");
  const [compart, setCompart] = useState("");

  //USESTATES DOS ERROS
  const [textErroEmail, setTextErroEmail] = useState("Email requerido");
  const [textErroNome, setTextErroNome] = useState("Nome requerido");
  const [textErroCQ, setTextErroCQ] = useState("Código já usado");

   //USESTATES DAS CLASSES DOS ERROS
   const [textErroEmailClass, setTextErroEmailClass] = useState("hidden");
   const [textErroNomeClass, setTextErroNomeClass] = useState("hidden");
   const [textErroCQClass, setTextErroCQClass] = useState("hidden");
  
  const [msgType, setMsgType] = useState("hidden");
  
  //USESTATES DE APOIO
  const [msg, setMsg] = useState("mensagem inicial");
  const [nome, setNome] = useState(false)
  const [email, setEmail] = useState(false)

  const [oldEmail] = useState(user.email); //usa esse state para guardar o email antes da atualização para comparar com o atual

  useEffect(() => {
    setUserId(user.idUser);
    setTextLogin(user.login);
    setTextEmail(user.email);
    setTextName(user.nameComplete);
    setDepto(user.Department.department);
    setStatus(user.Status.status);
    setCodCQ(user.codCQ)
    setCompart(user.sharedUser === 1 ? "Sim" : "Não"); 
    setRecebeEmail(user.sendEmail === 1 ? "Sim" : "Não");  
  },[user.nameComplete, user.Status.status, user.email, user.idUser, user.login, user.Department.department, user.idStatus, user.sharedUser]);

  useEffect(() => {
    // Encontrar o departamento correspondente no array
    const selectedDept = deptto.find((dept) => dept.department === depto);

    // Atualizar o estado do nível de acesso
    if (selectedDept) {
      setNivel(selectedDept.AccessLevel.accessLevel);
    }
  }, [depto, deptto, user.Department.department]);

  /* FUNÇÃO DO QUE VERIFICA O DEPARTAMENTO E LIGA COM O NÍVEL DO DEPARTAMENTO */
  const handleDepartmentChange = (e) => {
    const selectedDepartment = e.target.value;
    setDepto(selectedDepartment);

    // Encontrar o departamento correspondente no array
    const selectedDept = deptto.find((dept) => dept.department === selectedDepartment);

    // Atualizar o estado do nível de acesso
    if (selectedDept) {
      setNivel(selectedDept.AccessLevel.accessLevel);
      }
  };

  //FUNÇÃO DO BOTÃO DE SUBMIT DO FORMULÁRIO
  const handleSubmit =  async (e) => {
    e.preventDefault(); //PREVINE A AÇÃO DEFULT DO FORMULÁRIO

    if(textName === "" || textName === undefined){
      setTextErroNome("Nome requerido");
      setTextErroNomeClass("show")
    } else {
      setNome(true)
    }

    if(textEmail === "" || textEmail === undefined){
      setTextErroEmail("Email requerido");
      setTextErroEmailClass("show")
    } else if(!validator.isEmail(textEmail)){
      setTextErroEmail("Formato inválido");
      setTextErroEmailClass("show")
    } else {
      setEmail(true)
    }

      if( nome && email ){
        setEmail(false)
        setNome(false)
        try {
          const response = await checkLoginEmailCQ(textLogin, textEmail, codCQ );
          //SE JÁ EXISTE LOGIN OU EMAIL APRESENTA AS RESPECITIVAS MENSAGENS DE ERRO
          if((response.haveEmail && response.haveEmail !== oldEmail) || response.haveCodCQ ){
            if (response.haveEmail && response.haveEmail !== oldEmail) {
              setTextErroEmail("Email já existe");
              setTextErroEmailClass("show")
            };
            if (response.haveCodCQ) {
              setTextErroCQ("Código CQ já existe");
              setTextErroCQClass("show")
            };

          
          // SE TUDO OK CHAMA A API QUE VAI GRAVAR OS DADOS NO BANCO
          } else {
    
            //CONVERTE SETOR E STATUS NOVAMENTE EM IDs
            const statusId = stattus.find(item => item.status === status)?.idStatus;
            const setorId = deptto.find(item => item.department === depto)?.idDept;
            const shared = (compart  === "Sim" ? 1 : 0)
            const sendEmail = (recebeEmail  === "Sim" ? 1 : 0)
            
            const response = await updateUser(userId, textEmail, textName, setorId, statusId, shared, sendEmail, codCQ);
            setMsg(response.msg)
            if(response.msg_type === "success") {
              setMsgType("success")
            } else {
              setMsgType("error")
            }
    
            // Define um atraso de 3 segundos (3000 milissegundos) para reverter para "hidden"
            setTimeout(() => {
              setMsgType("hidden");
            }, 3000);
    
          };
        } catch (err) {
          console.error('Ocorreu um erro durante a consulta:', err);
        };    
      }
  };

  /* FUNÇÃO DO BOTÃO CANCELAR ... VOLTA PARA LISTA DE USERS */
  const handleCancel = (e) => {
    navigate("/ADM-TI/cadastro-usuarios"); 
  }

  //RENDERIZAÇÃO DA PÁGINA ****************************************************
    return (
    <section className="editarUsuarios">

      <h2>Visualizar ou alterar usuário</h2>
      <hr />

      <form className="form" onSubmit={handleSubmit}>

        <div className="bloco">
          
          <div className="ladoEsq">

            <div className="form-group">
              <label htmlFor="userlogin">Login: &emsp;</label>
              <input id="userlogin" className="desabilitado" type="text" value={textLogin} readOnly onChange={(e) => setLogin(e.target.value)} />
              <div className="erros none"></div>
            </div>
            <div className="tips">O login não pode ser alterado.</div>

            <div className="form-group">
              <label htmlFor="useremail">Email: &emsp;</label>
              <input id="useremail" 
                value={textEmail} type="text" onChange={(e) => {
                setTextEmail(e.target.value); 
                setTextErroEmail("");
                setTextErroEmailClass("hidden")
                setEmail(false)
                }} />
              <div className={"erros " +  textErroEmailClass}>{textErroEmail}</div>
            </div>

            <div className="form-group">
              <label htmlFor="usernome">Nome Completo: &emsp;</label>
              <input id="usernome"
                value={textName} type="text" onChange={(e) => {
                setTextName(e.target.value); 
                setTextErroNome("");
                setTextErroNomeClass("hidden")
                setNome(false)
                }} />
              <div className={"erros " +  textErroNomeClass}>{textErroNome}</div>
            </div>

            {/* Grupo CQ */}
            <div className="form-group">
              <label htmlFor="nivel">Código CQ: &emsp;</label>
              <input id="nivel" type="text" value={codCQ} onChange={(e) => {
                setCodCQ(e.target.value)
                setTextErroCQ("");
                setTextErroCQClass("hidden")
                }} />
              <div className={"erros " +  textErroCQClass}>{textErroCQ}</div>
            </div> '

          </div> {/* fecha o lado esquerdo */}

          <div className="ladoDir">

            {/* Grupo Departamento */}
            <div className="form-group">
              <label htmlFor="department">Departamento: &emsp;</label>
              <select id="department" name="department" onChange={handleDepartmentChange}>
                <option value={depto}>{depto}</option>
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
                <select id="stattus" name="stattus" value={status} onChange={(e) => setStatus(e.target.value)}>
                  {stattus.map((stt) => (
                    <option key={stt.status} value={stt.status}>
                      {stt.status}
                    </option>
                  ))}
                </select>
            </div>

            {/* Grupo RecebeEmail */}
            <div className="form-group">
              <label htmlFor="recebeemail">Recebe Email: &emsp;</label>
              <select id="recebeemail" name="recebeemail" value={recebeEmail} onChange={(e) => setRecebeEmail(e.target.value)}>
                <option>Não</option>
                <option>Sim</option>
              </select>
            </div>
        
            {/* Grupo Compartilhado */}
            <div className="form-group">
              <label htmlFor="shared">Compartilhado: &emsp;</label>
              <select id="shared" name="shared" value={compart} onChange={(e) => setCompart(e.target.value)}>
                <option>Não</option>
                <option>Sim</option>
              </select>
            </div>

            {/* Grupo Nível de Acesso */}
            <div className="form-group">
              <label htmlFor="nivel">Nível de Acesso: &emsp;</label>
              <div data-bs-toggle="tooltip" data-bs-placement="top" title="Esse valor não pode ser alterado aqui. Está ligado com o Departamento.">
                <input id="nivel" className="desabilitado" type="text" value={nivel} readOnly onChange={(e) => setNivel(e.target.value)} />
              </div>
            </div>

          </div>  {/* fecha o lado direito */}

        </div> {/* fecha AMBOS OS LADOS */}

        <hr />
        
        <div className="form-group botoes">
          <button className="defaultBtn escBtn" type="button" onClick ={handleCancel}>Cancelar</button>
          <button className="defaultBtn okBtn" type="submit">SALVAR &emsp; <small style={{ color: 'black' }}>(Duplo clique)</small></button>
        </div>  

        <div className="form-group">
          <div className={'msg ' + msgType}>{msg}</div>
        </div>

      </form>

    </section> 
  )
};

export default CadastroUsuariosEdit;