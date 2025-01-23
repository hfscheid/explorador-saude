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
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { fetchChartData } from "../services/fetchChartData";
import { getMun } from "../services/getMun";

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
    mun: "Belo Horizonte",
  });
  const [municipalities, setMunicipalities] = useState([]);

  useEffect(() => {
    const fetchMunicipalities = async () => {
      const muns = await getMun();
      setMunicipalities(muns);
    };

    fetchMunicipalities();
  }, []);

  useEffect(() => {
    fetchChartData(chartParams).then((data) => {
      if (data) {
        const datasets = data.datasets.map((dataset) => ({
          label: dataset.label,
          data: dataset.values,
          borderColor: "#742774",
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
          <FormControl>
            <InputLabel>Tabela</InputLabel>
            <Select
              multiple
              value={chartParams.table}
              onChange={(e) =>
                setChartParams({ ...chartParams, table: e.target.value })
              }
              renderValue={(selected) => selected.join(", ")}
            >
              <MenuItem value="dengue">
                <Checkbox checked={chartParams.table.indexOf("dengue") > -1} />
                <ListItemText primary="Dengue" />
              </MenuItem>
              <MenuItem value="chikungunya">
                <Checkbox
                  checked={chartParams.table.indexOf("chikungunya") > -1}
                />
                <ListItemText primary="Chikungunya" />
              </MenuItem>
              <MenuItem value="zika">
                <Checkbox checked={chartParams.table.indexOf("zika") > -1} />
                <ListItemText primary="Zika" />
              </MenuItem>
            </Select>
          </FormControl>
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
