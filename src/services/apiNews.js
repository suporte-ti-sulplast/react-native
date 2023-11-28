import axios from "axios";

export const api = axios.create({
    baseURL: "http://192.168.0.236:3000",
});


//CRIA NOTICIA NA TABELA DE NOTICIAS
export const createNews = async (textTiulo, data, textTexto, fileName, newFileName, status, dataInit, dataEnd, link) => {
    try{ 
      const response = await api.post("/new-addbd", {textTiulo, data, textTexto, fileName, newFileName, status, dataInit, dataEnd, link})
      return response.data;
    }   catch (error) {
      console.error("Ocorreu um erro ao fazer a requisição:", error);
      throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
    }
};

//LISTA TODOS AS NOTÍCIAS
export const findNews = async (data) =>
{
  try
  {
    const use =  await api.post("/new-list", {data})
    return use.data;
  }   
  catch (error)
  {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};




//DELETA NOTICIA DO BANCO DE DADOS
export const deleteNew = async (id) =>
{
  try
  {
     const response = await api.post("/news-delete",{id});
     return response.data; // Retornar os dados da resposta da API 
  }
  catch (error)
  {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

//ALTERA O STATUS DA NOTICIA DO BANCO DE DADOS
export const alterNewStatus = async (idNews, status) =>
{
  try
  {
     const response = await api.post("/news-alterStatus",{idNews, status});
     return response.data; // Retornar os dados da resposta da API 
  }
  catch (error)
  {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

//EDITA NOTICIA NA TABELA DE NOTICIAS
export const editNews = async (data, newFileName) =>
{
  try{ 
    const response = await api.post("/news-updatebd", {data, newFileName})
    return response.data;
  }   catch (error) {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};



export const findBirthdayPeople = async (primeiroDia, ultimoDia) =>
{
  try{ 
    const response = await api.post("/news-findBirthdayPeople", {primeiroDia, ultimoDia})
    return response.data;
  }   catch (error) {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};


