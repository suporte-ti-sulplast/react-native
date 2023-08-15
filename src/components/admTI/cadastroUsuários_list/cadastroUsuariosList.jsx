import "./index.scss";
import { findUsers, editUser, depptoStatus } from "../../../services/api";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const CadastroUsuarios =  () => {

  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await findUsers();
        const usersData = response.data.users;
        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        console.error('Ocorreu um erro durante a consulta:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
  }, [users]);

  if (loading) {
    return <div>Carregando...</div>;
  }

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
        <button className="defaultBtn" type="button" onClick ={handleNew}>Novo Usuário</button>
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
            <th className="short">Status</th>
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
                <td className="short">{user.Status.status}</td>
                <td className="short">
                  {user.sharedUser === 0 ? 
                    <img className="icon" src="../images/box-unchecked.png" alt="box-unchecked" /> : 
                    <img className="icon" src="../images/box-checked.png" alt="box-checked" />} 
                </td>
                <td className="short">
                  <img className="icon" src="../images/editar2.png" alt="editar2" 
                  onClick={() => handleEdit(user.idUser)} />
                </td>
                <td className="short">
                  <img className="icon" src="../images/senha2.png" alt="senha2" />
                </td>
                <td className="short">
                  <img className="icon" src="../images/lixeira-com-tampa.png" alt="lixeira-com-tampa" />
                </td>
              </tr>
            ))}
        </tbody>

      </table>
    </section>
  )
};

export default CadastroUsuarios;