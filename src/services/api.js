import axios from "axios";

export const api = axios.create({
    baseURL: "http://192.168.0.236:3000",
});


//VALIDAÇÃO DE LOGIN E CRIAÇÃO DE SESSÃO
export const createSession = async (login, password) => {
  try{ 
    const response = await api.post("/auth", {login, password})
    return response;
  }   catch (error) {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};


//BUSCA INFORMAÇÕES DO USUÁRIO LOGADO
export const findLogged = async (user) =>
{
  try
  {
    const response =  await api.post("/user-logged", { user })
    return response.data;
  }
  catch (error)
  {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

//BUSCA QUANTIDADE DE USUÁRIOS
export const numberUsers = async () => 
{
  try
  {
    const use =  await api.get("/user-number")
    return use;
  }   
  catch (error)
  {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};


//LISTA TODOS OS USUÁRIOS
export const findUsers = async (limit, page, max) =>
{
  try
  {
    const use =  await api.post("/user-list", {limit, page, max})
    return use;
  }   
  catch (error)
  {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};


//ABRE O FORM DE EDIÇÃO DO USUÁRIO
export const editUser = async (userId) =>
{
  try
  {
    const response = await api.post("/user-edit", { userId });    
    return response.data; // Retornar os dados da resposta da API
  }
  catch (error)
  {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

//BUSCA A LISTA DE DEPARTAMENTO E STATUS
export const depptoStatus = async () =>
{
  try
  {
    const response = await api.get("/deppto-status");
    return response.data; // Retornar os dados da resposta da API
  }
  catch (error)
  {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

//VALIDA SE EXISTE O LOGIN E A SENHA
export const checkLoginEmail = async (login, email) =>
{
  try
  {
    const response = await api.post("/login-email", { login, email });
    return response.data; // Retornar os dados da resposta da API
  } 
  catch (error)
  {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};


//ADICIONA O USUÁRIO NO BANO DE DADOS
export const createUser = async (login, name, email, setorId, statusId, compart, recebeEmail, senha) =>
{
  try
  {
    const response = await api.post("/user-addbd", { login, name, email, setorId, statusId, compart, recebeEmail, senha });
    return response.data; // Retornar os dados da resposta da API
  }
  catch (error)
  {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};


//ATUALIZA O USUÁRIO NO BANCO DE DADOS
export const updateUser = async ( userId, textEmail, textName, setorId, statusId, shared, recebeEmail) =>
{
  try
  {
    const response = await api.post("/user-updatebd", { userId, textName, textEmail, setorId, statusId, shared, recebeEmail });
    return response.data; // Retornar os dados da resposta da API
  } 
  catch (error) 
  {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};


//ALTERA A SENHA NO BANCO DE DADOS
export const alterPassword = async ( id, newPasword, forceChange) =>
{
  try
  {
    const response = await api.post("/user-newpassword",{id, newPasword, forceChange});
    return response.data; // Retornar os dados da resposta da API
  } 
  catch (error) 
  {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};


//VERIFICA NO BANCO DE DADOS SE A SENHA JÁ FOI USADA
export const validPassword = async (id, newPasword ) =>
{
  try
  {
    const response = await api.post("/user-validpassword",{id, newPasword});
    return response.data; // Retornar os dados da resposta da API
  }
  catch (error)
  {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

//PESQUISA DE USUÁRIO
export const searchUsers = async ( filter) =>
{

  console.log(filter)
/*   try
  {
    const response = await api.post("/user-delete",{id});
    return response.data; // Retornar os dados da resposta da API
  }
  catch (error)
  {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  } */

  return "voltou da api"
};

//DELETA USUÁRIO DO BANCO DE DADOS
export const deleteUser = async (id) =>
{
  try
  {
    const response = await api.post("/user-delete",{id});
    return response.data; // Retornar os dados da resposta da API
  }
  catch (error)
  {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

