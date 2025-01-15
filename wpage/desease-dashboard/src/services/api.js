const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your actual base URL

export const fetchRegionData = async () => {
  // Mock data for testing
  return {
    'Abre Campo': 120,
    'João Pinheiro': 250,
  };
  try {
      const response = await fetch(`${API_BASE_URL}/region-data`);
      if (!response.ok) {
          throw new Error(`Error fetching region data: ${response.statusText}`);
      }
      return await response.json();
  } catch (error) {
      console.error(error);
      return {};
  }
};


// Fetch Chart data
export const fetchChartData = async () => {
    // try {
    //     const response = await fetch(`${API_BASE_URL}/chart-data`);
    //     if (!response.ok) {
    //         throw new Error(`Error fetching Chart data: ${response.statusText}`);
    //     }
    //     return await response.json();
    // } catch (error) {
    //     console.error(error);
    //     return null;
    // }
    return {
      labels: ['2020', '2021', '2022'],
      datasets: [
          {
              label: 'Dataset 1',
              values: [100, 200, 300],
              color: '#742774',
          },
          {
              label: 'Dataset 2',
              values: [150, 250, 350],
              color: '#FF5733',
          },
      ],
  };
};


// Fetch Table Data
export const fetchTableData = async () => {
  return [
    { key: 1, region: 'Belo Horizonte', cases: 200 },
    { key: 2, region: 'Uberlândia', cases: 150 },
    { key: 3, region: 'Contagem', cases: 100 },
];
  try {
      const response = await fetch(`${API_BASE_URL}/table-data`);
      if (!response.ok) {
          throw new Error(`Error fetching table data: ${response.statusText}`);
      }
      return await response.json();
  } catch (error) {
      console.error(error);
      // Return mock data in case of error
      return [
          { key: 1, region: 'Belo Horizonte', cases: 200 },
          { key: 2, region: 'Uberlândia', cases: 150 },
          { key: 3, region: 'Contagem', cases: 100 },
      ];
  }
};