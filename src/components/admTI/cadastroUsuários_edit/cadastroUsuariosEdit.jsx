import "./index.scss";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const CadastroUsuariosEdit = ( props ) => {

  const navigate = useNavigate();

  const user = props.userData.user;
  const deptto = props.userData.deptto;

  const initialDepartment = user.Department.department;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [depto, setDepto] = useState(initialDepartment);
  const [nivel, setNivel] = useState("");
  const [status, setStatus] = useState("");
  const [compart, setCompart] = useState("");

  useEffect(() => {
    setName(user.nameComplete);
    setEmail(user.email);
    setLogin(user.login);
    setDepto(user.Department.department);
    setStatus(user.idStatus === 1 ? "Ativo" : "Inativo");
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

  /* FUNÇÃO DO BOTÃO CANCELAR ... VOLTA PARA LISTA DE USERS */
  const handleCancel = (e) => {
    navigate("/ADM-TI/cadastro-usuarios"); 
  }

    return (
    <section className="editarUsuarios">

      <h2>Visualizar || Alterar Usuário</h2>
      <hr />

      <form action="">

        <form-group>
          <label htmlFor="">Login: &emsp;</label>
          <div data-bs-toggle="tooltip" data-bs-placement="top" title="Esse valor não pode ser alterado.">
            <input className="desabilitado" type="text" value={login} readOnly onChange={(e) => setLogin(e.target.value)} />
          </div>
        </form-group>

        <form-group>
          <label htmlFor="">Nome Completo: &emsp;</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </form-group>

        <form-group>
          <label htmlFor="">Email: &emsp;</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
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
          <div data-bs-toggle="tooltip" data-bs-placement="top" title="Esse valor pode ser alterado pela lista de usuários.">
            <input className="desabilitado" type="text" value={status} readOnly onChange={(e) => setStatus(e.target.value)} />
          </div>
        </form-group>
        
        <form-group>
          <label htmlFor="">Compartilhado: &emsp;</label>
          <div data-bs-toggle="tooltip" data-bs-placement="top" title="Esse valor pode ser alterado pela lista de usuários.">
            <input className="desabilitado" type="text" value={compart} readOnly onChange={(e) => setCompart(e.target.value)} />
          </div>
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

      </form>

    </section> 
  )
};

export default CadastroUsuariosEdit;