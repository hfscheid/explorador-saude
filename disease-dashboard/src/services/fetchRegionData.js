import api from "./api";

export const fetchRegionData = async ({table, tinit, tend, year}) => {
  try {
    const response = await api.get(
      `/map?table=${table}&tinit=${tinit}&tend=${tend}&year=${year}`
    );

    return response.data;
  } catch (error) {
    console.error(`Error fetching region data: ${error.message}`);

    return {
      "Abre Campo": 100,
      "Belo Horizonte": 200,
      Contagem: 150,
      Uberlândia: 300,
    };
  }
};
