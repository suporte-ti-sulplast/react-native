import "./index.scss";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { checkLoginEmail, updateUser } from "../../../services/api";

const CadastroUsuariosEdit = ( props ) => {

  const navigate = useNavigate();

  const user = props.userData.userData.user;
  const deptto = props.userData.depptoStatus.deptto;
  const stattus = props.userData.depptoStatus.stattus;

  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [depto, setDepto] = useState("");
  const [status, setStatus] = useState("");
  const [nivel, setNivel] = useState("");
  const [compart, setCompart] = useState("");
  //USESTATES DOS ERROS
  const [errorName, setErrorName] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [msgType, setMsgType] = useState("hidden");
  //USESTATES DE APOIO
  const [msg, setMsg] = useState("mensagem inicial");

  useEffect(() => {
    setUserId(user.idUser);
    setName(user.nameComplete);
    setEmail(user.email);
    setLogin(user.login);
    setDepto(user.Department.department);
    setStatus(user.Status.status);
    setCompart(user.sharedUser === 1 ? "Sim" : "Não");   
  },[user.nameComplete, user.email, user.login, user.Department.department, user.idStatus, user.sharedUser]);

  useEffect(() => {
    // Encontrar o departamento correspondente no array
    const selectedDept = deptto.find((dept) => dept.department === depto);

    // Atualizar o estado do nível de acesso
    if (selectedDept) {
      setNivel(selectedDept.AccessLevel.accessLevel);
    }
  }, [depto, user.Department.department]);

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

    try {
      const response = await checkLoginEmail(login,email );
      //SE JÁ EXISTE LOGIN OU EMAIL APRESENTA AS RESPECITIVAS MENSAGENS DE ERRO
      if(response.email ){
          setErrorEmail("error-message-email");
          setEmail("Email existente");
      // SE TUDO OK CHAMA A API QUE VAI GRAVAR OS DADOS NO BANCO
      } else {

        //CONVERTE SETOR E STATUS NOVAMENTE EM IDs
        const statusId = stattus.find(item => item.status === status)?.idStatus;
        const setorId = deptto.find(item => item.department === depto)?.idDept;
        const shared = (compart  === "Sim" ? 1 : 0)
        
        const response = await updateUser(userId, name, email, setorId, statusId, shared);
        console.log(userId, name, email, setorId, statusId, shared)
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

  };

  /* FUNÇÃO DO BOTÃO CANCELAR ... VOLTA PARA LISTA DE USERS */
  const handleCancel = (e) => {
    navigate("/ADM-TI/cadastro-usuarios"); 
  }

    return (
    <section className="editarUsuarios">

      <h2>Visualizar || Alterar Usuário</h2>
      <hr />

      <form className="form" onSubmit={handleSubmit}>

        <form-group>
          <label htmlFor="">Login: &emsp;</label>
          <div data-bs-toggle="tooltip" data-bs-placement="top" title="Esse valor não pode ser alterado.">
            <input className="desabilitado" type="text" value={login} readOnly onChange={(e) => setLogin(e.target.value)} />
          </div>
        </form-group>

        <form-group>
          <label htmlFor="">Nome Completo: &emsp;</label>
          <input  className={errorName}  type="text" value={name}  onClick={(e) => {setErrorName(""); setName("")}} onChange={(e) => setName(e.target.value)} />
        </form-group>

        <form-group>
          <label htmlFor="">Email: &emsp;</label>
          <input className={errorEmail} type="text" value={email} onClick={(e) => {setErrorEmail(""); setEmail("")}} onChange={(e) => setEmail(e.target.value)} />
        </form-group>
        
        <form-group>
          <label htmlFor="">Departamento: &emsp;</label>
          <select id="department" name="department" onChange={handleDepartmentChange}>
            <option value={depto}>{depto}</option>
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
          <select id="department" name="department" onChange={(e) => setCompart(e.target.value)}>
              <option>Não</option>
              <option>Sim</option>
            </select>
        </form-group>

        <form-group >
          <label htmlFor="">Nível de Acesso: &emsp;</label>
          <div data-bs-toggle="tooltip" data-bs-placement="top" title="Esse valor não pode ser alterado aqui. Está ligado com o Departamento.">
            <input className="desabilitado" type="text" value={nivel} readOnly onChange={(e) => setNivel(e.target.value)} />
          </div>
        </form-group>
        
        <form-group>
          <button className="defaultBtn esc" type="button" onClick ={handleCancel}>Cancelar</button>
          <button className="defaultBtn confirm" type="submit">Salvar alterações</button>
        </form-group>     

        <form-group>
          <div className={'msg ' + msgType}>{msg}</div>
        </form-group>

      </form>

    </section> 
  )
};

export default CadastroUsuariosEdit;