import api from "./api";

export const getTables = async () => {
  try {
    const response = await api.get("/tables");
    
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error(`Error fetching tables: ${error.message}`);

    return ["dengue", "chikungunya", "zika"];
  }
};
