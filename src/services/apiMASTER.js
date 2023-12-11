import axios from "axios";

export const api = axios.create({
    baseURL: "http://192.168.0.236:3000",
});


//UPLOAD DE IMAGENS NO BACKEND
export const upload = async (image) => {
    try{ 
      const response = await api.post("/upload", image)
      return response.data;
    }   catch (error) {
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

//BUSCAR ARQUIVOS NA PASTA SGI
export const fetchPdfBlob = async (fileName) => {

  console.log(fileName)

  try
  {
    const response = await api.get(`/api/pdf/${fileName}`);
    console.log(response.data)
    return response.data; // Retornar os dados da resposta da API

  }
  catch (error)
  {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }


};