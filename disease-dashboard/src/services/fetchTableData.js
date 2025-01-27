import api from "./api";

export const fetchTableData = async ({table, tinit, tend}) => {
  table = "dengue";
  tinit = 1;
  tend = 53;
  try {
    const response = await api.get(
      `/ranking?${table}&tinit=${tinit}&tend=${tend}`
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
