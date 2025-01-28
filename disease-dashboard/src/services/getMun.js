import api from "./api";

export const getMun = async (table) => {
  try {
    const params = new URLSearchParams();
    if (Array.isArray(table)) {
      table.forEach((t) => params.append("table", t));
    } else {
      params.append("table", table);
    }

    const response = await api.get(`/muns?${params.toString()}`);
    
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error(`Error fetching municipalities: ${error.message}`);

    return ["Abre Campo", "Belo Horizonte", "Contagem", "Uberlândia"];
  }
};
