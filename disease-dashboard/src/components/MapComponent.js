import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import geoJSONData from "../data/geojs.json";
import { fetchRegionData } from "../services/fetchRegionData";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { getTables } from "../services/getTables";

function transformData(input) {
  return input.reduce((result, { municipio, total }) => {
    const municipios = municipio.split(","); // Split municipios by comma
    municipios.forEach((city) => {
      result[city.trim()] = total; // Assign the total to each city
    });
    return result;
  }, {});
}

function MapComponent() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapParams, setMapParams] = useState({
    table: "dengue",
    tinit: "1",
    tend: "53",
  });
  const [tables, setTables] = useState([]);
  const weeks = Array.from({ length: 53 }, (_, i) => i + 1);

  useEffect(() => {
    const fetchTables = async () => {
      const tables = await getTables();
      setTables(tables)
    };
    fetchTables();
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, { center: [-18.9, -45.0], zoom: 6 });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      fetchRegionData(mapParams).then((regionData) => {
        regionData = transformData(regionData);

        // Handle outliers in data
        // regionData = handleOutliers(regionData);

        // eslint-disable-next-line
        const geojson = L.geoJson(geoJSONData, {
          style: (feature) => ({
            fillColor: getRegionColor(feature.properties.name, regionData),
            weight: 1,
            opacity: 1,
            color: "white",
            dashArray: "3",
            fillOpacity: 0.7,
          }),
          onEachFeature: (feature, layer) => {
            const regionName = feature.properties.name;
            const regionCases = regionData[regionName] || 0;

            layer.bindTooltip(`${regionName}: ${regionCases} cases`);
            layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight,
            });
          },
        }).addTo(map);

        // Add legend to the map
        addLegend(map, regionData);
      });

      mapInstanceRef.current = map;
    }
  }, []);

  // const getRegionColor = (regionName, regionData) => {
  //     const cases = regionData[regionName] || 0;

  //     const values = Object.values(regionData);
  //     const minCases = Math.min(...values);
  //     const maxCases = Math.max(...values);

  //     // Normalize the cases value to a range of 0-1
  //     const normalized = (cases - minCases) / (maxCases - minCases);

  //     // Interpolate colors between blue (low) and red (high)
  //     const r = Math.floor(normalized * 255);
  //     const g = 0;
  //     const b = Math.floor((1 - normalized) * 255);

  //     return `rgb(${r}, ${g}, ${b})`;
  // };

  const getRegionColor = (regionName, regionData) => {
    const cases = regionData[regionName] || 0;

    const values = Object.values(regionData).map((value) => value || 1); // Vermeide log(0) durch Ersetzung von 0 durch 1
    const minCases = Math.min(...values);
    const maxCases = Math.max(...values);

    // Logarithmische Transformation der Fälle
    const logCases = Math.log10(cases || 1); // Fallback für den Fall, dass `cases` 0 ist
    const logMin = Math.log10(minCases || 1);
    const logMax = Math.log10(maxCases || 1);

    // Normalisieren im logarithmischen Bereich
    const normalized = logCases / logMax;

    // Interpolation der Farben zwischen Blau (niedrig) und Rot (hoch)
    const r = Math.floor(normalized * 255);
    const g = 0;
    const b = Math.floor((1 - normalized) * 255);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const addLegend = (map, regionData) => {
    const values = Object.values(regionData);
    const minCases = Math.min(...values);
    const maxCases = Math.max(...values);

    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const grades = [minCases, maxCases];
      const labels = grades.map(
        (value, index) =>
          `<i style="background: ${getRegionColor(
            index === 0 ? "low" : "high",
            { low: minCases, high: maxCases }
          )}"></i> ${value}`
      );

      div.innerHTML = labels.join("<br>");
      return div;
    };

    legend.addTo(map);
  };

  const handleOutliers = (regionData) => {
    const values = Object.values(regionData);
    const q1 = getPercentile(values, 25);
    const q3 = getPercentile(values, 75);
    const iqr = q3 - q1; // Interquartile range
    const upperLimit = q3 + 1.5 * iqr;

    return Object.fromEntries(
      Object.entries(regionData).map(([key, value]) => [
        key,
        value >= 0 && value <= upperLimit ? value : upperLimit, // Cap outliers to upper limit
      ])
    );
  };

  const getPercentile = (values, percentile) => {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  };

  const highlightFeature = (e) => {
    const layer = e.target;
    layer.setStyle({
      weight: 5,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7,
    });
    layer.bringToFront();
  };

  const resetHighlight = (e) => {
    const layer = e.target;
    mapInstanceRef.current.eachLayer((geoLayer) => {
      if (geoLayer.resetStyle) geoLayer.resetStyle(layer);
    });
  };

  return (
    <div>
      <h2>Heatmap of Minas Gerais</h2>
      <div
        ref={mapRef}
        id="map"
        style={{ height: "500px", width: "100%" }}
      ></div>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
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
              label="Doença"
              value={mapParams.table}
              onChange={(e) =>
                setMapParams({ ...mapParams, table: e.target.value })
              }
                renderValue={(selected) => selected}
            >
              {tables.map((table) => (
                <MenuItem key={table} value={table}>
                  {table}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Select
            label="Início"
            value={mapParams.tinit}
            onChange={(e) =>
              setMapParams({ ...mapParams, tinit: e.target.value })
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
            value={mapParams.tend}
            onChange={(e) =>
              setMapParams({ ...mapParams, tend: e.target.value })
            }
          >
            {weeks.map((week) => (
              <MenuItem key={week} value={week}>
                {week}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}

export default MapComponent;
