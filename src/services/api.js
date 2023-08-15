import axios from "axios";

export const api = axios.create({
    baseURL: "http://192.168.0.236:3000",
});

export const createSession = async (login, password) => {
    return await api.post("/auth", {login, password})
};

export const findUsers = async () => {
    try{
        const use =  await api.get("/user-list")
        return use;
    }   catch (error) {
        console.error("Ocorreu um erro ao fazer a requisição:", error);
        throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
      }
};

export const editUser = async (userId) => {
    try {
      const response = await api.post("/user-edit", { userId });
      
      return response.data; // Retornar os dados da resposta da API
    } catch (error) {
      console.error("Ocorreu um erro ao fazer a requisição:", error);
      throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
    }
};

export const depptoStatus = async () => {
  try {
    const response = await api.get("/deppto-status");
    return response.data; // Retornar os dados da resposta da API
  } catch (error) {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

export const checkLoginEmail = async (login, email) => {
  try {
    const response = await api.post("/login-email", { login, email });
    return response.data; // Retornar os dados da resposta da API
  } catch (error) {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

export const createUser = async (login, name, email, setorId, statusId, compart, senha) => {
  try {
    const response = await api.post("/user-addbd", { login, name, email, setorId, statusId, compart, senha });
    return response.data; // Retornar os dados da resposta da API
  } catch (error) {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

export const updateUser = async ( userId, name, email, setorId, statusId, shared) => {
  try {
    const response = await api.post("/user-updatebd", { userId, name, email, setorId, statusId, shared });
    return response.data; // Retornar os dados da resposta da API
  } catch (error) {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }

  return ("ok")
};

