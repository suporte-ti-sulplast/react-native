import axios from "axios";

export const api = axios.create({
    baseURL: "http://192.168.0.236:3000",
});


//IMPRIME ETIQUETA QUALIDADE
export const labelPrintQualidade = async (coq, data, qtdade, ip) => {
    try{ 
      const response = await api.post("/etq-quali-print", {coq, data, qtdade, ip})
      return response.data;
    }   catch (error) {
      console.error("Ocorreu um erro ao fazer a requisição:", error);
      throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
    }
};

//IMPRIME ETIQUETA CURA
export const labelPrintCura = async (qtdade, ip) => {
  try{ 
    const response = await api.post("/etq-cura-print", {qtdade, ip})
    return response.data;
  }   catch (error) {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

//IMPRIME ETIQUETA  DATA
export const labelPrintData = async (qtdade, data, ip) => {
  console.log(qtdade, data)
  try{ 
    const response = await api.post("/etq-data-print", {qtdade, data, ip})
    return response.data;
  }   catch (error) {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

//IMPRIME ETIQUETA TESTE
export const labelPrintTeste = async (qtdade, texto, ip) => {
  try{ 
    const response = await api.post("/etq-teste-print", {qtdade, texto, ip})
    return response.data;
  }   catch (error) {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

//IMPRIME ETIQUETA TESTE
export const labelPrintRotoSearch = async (texto, ip) => {
  try{ 
    const response = await api.post("/etq-roto-print-search", {texto, ip})
    return response.data;
  }   catch (error) {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

//IMPRIME ETIQUETA TESTE
export const labelPrintRoto = async (qtdade, codigo, material, ip) => {
  try{ 
    const response = await api.post("/etq-roto-print", {qtdade, codigo, material, ip})
    return response.data;
  }   catch (error) {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};


//IMPRIME ETIQUETA BARCODE39
export const labelPrintBarCode39 = async (qtdade, codigo, setLegenda, ip) => {
  try{ 
    const response = await api.post("/etq-barcode39-print-search", {qtdade, codigo, setLegenda, ip})
    return response.data;
  }   catch (error) {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};



