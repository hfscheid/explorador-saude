import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import geoJSONData from '../data/geojs.json';
import { fetchRegionData } from '../services/api';

function MapComponent() {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!mapInstanceRef.current) {
            // Initialize the map only once
            const map = L.map(mapRef.current, { center: [-18.9, -45.0], zoom: 6 });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(map);

            fetchRegionData().then((regionData) => {
                const geojson = L.geoJson(geoJSONData, {
                    style: (feature) => ({
                        fillColor: getRegionColor(feature.properties.name, regionData),
                        weight: 1,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
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
            });

            mapInstanceRef.current = map;
        }
    }, []);

    const getRegionColor = (regionName, regionData) => {
        const cases = regionData[regionName] || 0;
        return cases > 150 ? '#ff0000' : cases > 50 ? '#ffa500' : '#03BD22';
    };

    const highlightFeature = (e) => {
        const layer = e.target;
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
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
            <div ref={mapRef} id="map" style={{ height: '500px', width: '100%' }}></div>
        </div>
    );
}

export default MapComponent;
