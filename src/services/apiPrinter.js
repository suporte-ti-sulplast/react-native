import axios from "axios";

export const api = axios.create({
    baseURL: "http://192.168.0.236:3000",
});

//LISTA IMPRESSORAS
export const printerList = async () => {
  try{ 
    const response = await api.get("/print-list")
    return response.data;
  }   catch (error) {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

//CADASTRA IMPRESSORAS
export const printerCreate = async (data) => {
  try{ 
    const response = await api.post("/print-create", {data})
    return response.data;
  }   catch (error) {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

//BUSCA IMPRESSORAS
export const printerSearch = async (data) => {
  try{ 
    const response = await api.post("/print-search", {data})
    return response.data.impressoras;
  }   catch (error) {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

//ALTERA O STATUS DA NOTICIA DO BANCO DE DADOS
export const alterPrinterStatus = async (idPrinter, status) =>
{
  try
  {
     const response = await api.post("/print-alterStatus",{idPrinter, status});
     return response.data; // Retornar os dados da resposta da API 
  }
  catch (error)
  {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

//DELETA IMPRESSORA DO BANCO DE DADOS
export const deletePrinter = async (id) =>
{
  try
  {
     const response = await api.post("/print-delete",{id});
     return response.data; // Retornar os dados da resposta da API 
  }
  catch (error)
  {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

//EDITA IMPRESSORA
export const printerEdit = async (idPrinter) => {
  try{ 
    const response = await api.post("/print-edit", { idPrinter })
    return response.data;
  }   catch (error) {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

//VERIFICA NOME/IP
export const verificaNomeIP = async (nome, ip, controle, nomeOld, ipOld) => {
  try{ 
    const response = await api.post("/print-nameIP", {nome, ip, controle, nomeOld, ipOld})
    return response.data;
  }   catch (error) {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

//SALVA ALTERAÇÃO NO BANCO
export const printerEditSave = async (data) => {
  try{ 
    const response = await api.post("/print-edit-save", {data})
    return response.data;
  }   catch (error) {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};