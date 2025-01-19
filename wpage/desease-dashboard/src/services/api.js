import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Replace with your actual base URL

// Fetch Region Data
export const fetchRegionData = async () => {
    try {
        const table = 'dengue';
        const tinit = 0
        const tend = 53
        const response = await axios.get(`${API_BASE_URL}/map?table=${table}&tinit=${tinit}&tend=${tend}`);
        // console.log(JSON.stringify(response.data))
        return response.data;
    } catch (error) {
        console.error(`Error fetching region data: ${error.message}`);
        return {'Abre Campo': 100, 'Belo Horizonte': 200, 'Contagem': 150, 'Uberlândia': 300};
    }
};

// Fetch Chart Data
export const fetchChartData = async () => {
    // return {
    //     labels: ['2020', '2021', '2022'],
    //     datasets: [
    //         {
    //             label: 'Dataset 1',
    //             values: [100, 200, 300],
    //             color: '#742774',
    //         },
    //         {
    //             label: 'Dataset 2',
    //             values: [150, 250, 350],
    //             color: '#FF5733',
    //         },
    //     ],
    // };
    // eslint-disable-next-line
    try {
        const table = 'dengue';
        const mun = 'Divinópolis'
        const tinit = 0
        const tend = 53
        const response = await axios.get(`${API_BASE_URL}/series?table=${table}&table=chikungunya&mun=${mun}&tinit=${tinit}&tend=${tend}`);
        console.log(JSON.stringify(response.data))
        return response.data;
    } catch (error) {
        console.error(`Error fetching Chart data: ${error.message}`);
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
    }
};

// Fetch Table Data
export const fetchTableData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/table-data`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching table data: ${error.message}`);
        return [
            { key: 1, region: 'Belo Horizonte', cases: 200 },
            { key: 2, region: 'Uberlândia', cases: 150 },
            { key: 3, region: 'Contagem', cases: 100 },
        ];
    }
};
