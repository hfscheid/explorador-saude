import api from "./api";

export const getMun = async () => {
  try {
    const response = await api.get("/muns");
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching municipalities: ${error.message}`);

    return ["Abre Campo", "Belo Horizonte", "Contagem", "Uberlândia"];
  }
};
