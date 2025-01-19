import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchChartData } from '../services/api';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

function ChartComponent({ containerStyle }) {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        fetchChartData().then((data) => {
            if (data) {
                const datasets = data.datasets.map((dataset) => ({
                    label: dataset.label,
                    data: dataset.values,
                    borderColor: '#742774',
                    fill: false,
                }));

                setChartData({
                    labels: data.labels,
                    datasets: datasets,
                });
            }
        });
    }, []);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.raw}`;
                    },
                },
            },
        },
        scales: {
            x: { title: { display: true, text: 'Semana epidemiológica' } },
            y: { title: { display: true, text: 'Número de casos' } },
        },
    };

    return (
        <div style={{ ...containerStyle }}>
            <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Dados Históricos</h2>
            <div style={{ width: '100%', height: '100%' }}>
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}

export default ChartComponent;
