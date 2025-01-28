import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Select, MenuItem } from "@mui/material";
import { fetchChartData } from "../services/fetchChartData";
import { getMun } from "../services/getMun";
import { getTables } from "../services/getTables";
import rgbHex from "rgb-hex";
import DiseaseSelect from "./DiseaseSelectComponent";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

function ChartComponent({ containerStyle }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [chartParams, setChartParams] = useState({
    table: ["dengue"],
    tinit: "1",
    tend: "53",
    mun: "Divinópolis",
  });
  const [municipalities, setMunicipalities] = useState([]);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchMunicipalities = async () => {
      const muns = await getMun(chartParams.table);
      setMunicipalities(muns);
    };
    fetchMunicipalities();
  }, [chartParams]);

  useEffect(() => {
    const fetchTables = async () => {
      const tables = await getTables();
      setTables(tables);
    };

    fetchTables();
  }, []);

  useEffect(() => {
    fetchChartData(chartParams).then((data) => {
      if (data) {
        const datasets = data.datasets.map((dataset) => ({
          label: dataset.label,
          data: dataset.values,
          borderColor:
            "#" +
            rgbHex(
              Math.floor(Math.random() * 256),
              Math.floor(Math.random() * 256),
              Math.floor(Math.random() * 256)
            ),
          fill: false,
        }));

        setChartData({
          labels: data.labels,
          datasets: datasets,
        });
      }
    });
  }, [chartParams]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: { title: { display: true, text: "Semana epidemiológica" } },
      y: { title: { display: true, text: "Número de casos" } },
    },
  };

  const weeks = Array.from({ length: 53 }, (_, i) => i + 1);

  return (
    <div style={{ ...containerStyle }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
        Dados Históricos
      </h2>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Line data={chartData} options={chartOptions} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: "10px",
            marginLeft: "10px",
          }}
        >
          <DiseaseSelect
            params={chartParams}
            setParams={setChartParams}
            menuItems={tables}
          />
          <Select
            label="Início"
            value={chartParams.tinit}
            onChange={(e) =>
              setChartParams({ ...chartParams, tinit: e.target.value })
            }
          >
            {weeks.map((week) => (
              <MenuItem key={week} value={week}>
                {week}
              </MenuItem>
            ))}
          </Select>
          <Select
            label="Fim"
            value={chartParams.tend}
            onChange={(e) =>
              setChartParams({ ...chartParams, tend: e.target.value })
            }
          >
            {weeks.map((week) => (
              <MenuItem key={week} value={week}>
                {week}
              </MenuItem>
            ))}
          </Select>
          <Select
            label="Município"
            value={chartParams.mun}
            onChange={(e) =>
              setChartParams({ ...chartParams, mun: e.target.value })
            }
          >
            {municipalities.map((mun) => (
              <MenuItem key={mun} value={mun}>
                {mun}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}

export default ChartComponent;
