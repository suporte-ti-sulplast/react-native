import axios from "axios";

export const api = axios.create({
    baseURL: "http://192.168.0.236:3000",
});


//BUSCA QUATIDADE DE USUÁRIOS
export const consulta = async (data) => 
{
  try
  {
    const response =  await api.post("/consultaFechamentoEstoque", {data});
    return response;
  }   
  catch (error)
  {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};