import api from "./api";

export const fetchTableData = async ({table, tinit, tend}) => {
  try {
    const response = await api.get(
      `/ranking?table=${table}&tinit=${tinit}&tend=${tend}`
    );

    return response.data;
  } catch (error) {
    console.error(`Error fetching table data: ${error.message}`);
    
    return [
      { key: 1, region: "Belo Horizonte", cases: 200 },
      { key: 2, region: "Uberlândia", cases: 150 },
      { key: 3, region: "Contagem", cases: 100 },
    ];
  }
};
