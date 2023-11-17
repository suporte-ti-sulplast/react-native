import axios from "axios";

export const api = axios.create({
    baseURL: "http://192.168.0.236:3000",
});


//BUSCA LISTA DE VEICULOS
export const findVehicles = async () => {
    try{ 
      const response = await api.get("/port-list-vehicles");
      return response.data;
    }   catch (error) {
      console.error("Ocorreu um erro ao fazer a requisição:", error);
      throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
    }
};

//BUSCA MOVIMENTOS DO VEICULOS
export const findMovimentVehicles = async (veiculoId) => {
  try{ 
    const response = await api.post("/port-list-moviment-vehicles", {veiculoId});
    return response.data;
  }   catch (error) {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

//SALVA/ATUALIZA MOVIMENTOS DO VEICULOS
export const movimentSave = async (data) => {
  try{ 
    const response = await api.post("/port-save-moviment-vehicles", {data});
    return response.data;
  }   catch (error) {
    console.error("Ocorreu um erro ao fazer a requisição:", error);
    throw error; // Lançar o erro novamente para ser tratado pelo chamador da função, se necessário
  }
};

