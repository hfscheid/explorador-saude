import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import geoJSONData from "../data/geojs.json";
import { fetchRegionData } from "../services/fetchRegionData";
import { Select, MenuItem } from "@mui/material";
import DiseaseSelect from "./DiseaseSelectComponent";

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
  const geoJsonLayerRef = useRef(null); // Ref for the GeoJSON layer

  const [mapParams, setMapParams] = useState({
    table: ["dengue"],
    tinit: "1",
    tend: "53",
  });

  const weeks = Array.from({ length: 53 }, (_, i) => i + 1);

  useEffect(() => {
    // Initialize the map only once
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, { center: [-18.9, -45.0], zoom: 6 });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      mapInstanceRef.current = map;
    }
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Fetch region data and update the map
    fetchRegionData(mapParams).then((regionData) => {
      regionData = transformData(regionData);

      // Remove existing GeoJSON layer if it exists
      if (geoJsonLayerRef.current) {
        mapInstanceRef.current.removeLayer(geoJsonLayerRef.current);
      }

      // Add updated GeoJSON layer
      const geoJsonLayer = L.geoJson(geoJSONData, {
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
      });

      geoJsonLayer.addTo(mapInstanceRef.current);

      // Store the GeoJSON layer in the ref for future updates
      geoJsonLayerRef.current = geoJsonLayer;
    });
  }, [mapParams]); // Re-run this effect whenever `mapParams` changes

  const getRegionColor = (regionName, regionData) => {
    const cases = regionData[regionName] || 0;

    const values = Object.values(regionData).map((value) => value || 1);
    const minCases = Math.min(...values);
    const maxCases = Math.max(...values);

    const logCases = Math.log10(cases || 1);
    const logMin = Math.log10(minCases || 1);
    const logMax = Math.log10(maxCases || 1);

    const normalized = (logCases - logMin) / (logMax - logMin);

    const r = Math.floor(normalized * 255);
    const g = 0;
    const b = Math.floor((1 - normalized) * 255);

    return `rgb(${r}, ${g}, ${b})`;
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
    geoJsonLayerRef.current.resetStyle(layer);
  };

  return (
    <div>
      <h2>Mapa de Calor de Minas Gerais</h2>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <DiseaseSelect
          params={mapParams}
          setParams={setMapParams}
          multiSelect={false}
        />
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
          onChange={(e) => setMapParams({ ...mapParams, tend: e.target.value })}
        >
          {weeks.map((week) => (
            <MenuItem key={week} value={week}>
              {week}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div
        ref={mapRef}
        id="map"
        style={{ height: "500px", width: "100%" }}
      ></div>
    </div>
  );
}

export default MapComponent;
