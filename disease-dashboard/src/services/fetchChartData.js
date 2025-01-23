import api from "./api";

export const fetchChartData = async ({ table, tinit, tend, mun }) => {
try {
  const params = new URLSearchParams();

  if (Array.isArray(table)) {
    table.forEach((t) => params.append("table", t));
  } else {
    params.append("table", table);
  }

  params.append("mun", mun);
  params.append("tinit", tinit);
  params.append("tend", tend);

  const response = await api.get(`/series?${params.toString()}`);

  return response.data;
} catch (error) {
  console.error(`Error fetching Chart data: ${error.message}`);

  return {
    labels: ["2020", "2021", "2022"],
    datasets: [
      {
        label: "Dataset 1",
        values: [100, 200, 300],
        color: "#742774",
      },
      {
        label: "Dataset 2",
        values: [150, 250, 350],
        color: "#FF5733",
      },
    ],
  };
}
};